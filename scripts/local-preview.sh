#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

MODE="${1:-serve}"
HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-4000}"

usage() {
  cat <<'EOF'
Usage:
  ./scripts/local-preview.sh [serve|build|static]

Modes:
  serve   Install missing gems (if needed) and start Jekyll preview server.
  build   Install missing gems (if needed) and build static files into _site/.
  static  Serve existing _site/ with python http.server (no Bundler/Jekyll).

Environment overrides:
  HOST=127.0.0.1
  PORT=4000
  BUNDLE_PATH=/tmp/behop-bundle
  BUNDLE_USER_HOME=/tmp/bundle-home
EOF
}

if [[ "$MODE" == "-h" || "$MODE" == "--help" ]]; then
  usage
  exit 0
fi

if [[ "$MODE" != "serve" && "$MODE" != "build" && "$MODE" != "static" ]]; then
  echo "[error] Unknown mode: $MODE"
  usage
  exit 1
fi

export BUNDLE_PATH="${BUNDLE_PATH:-/tmp/behop-bundle}"
export BUNDLE_USER_HOME="${BUNDLE_USER_HOME:-/tmp/bundle-home}"
mkdir -p "$BUNDLE_PATH" "$BUNDLE_USER_HOME"

enable_macos_system_ruby_header_patch_if_needed() {
  if [[ "$(uname -s)" != "Darwin" ]]; then
    return
  fi

  local ruby_arch_header
  ruby_arch_header="$(ruby -rrbconfig -e 'print RbConfig::CONFIG["rubyarchhdrdir"]')"
  if [[ -n "$ruby_arch_header" && -d "$ruby_arch_header" ]]; then
    return
  fi

  local ruby_version ruby_major_minor sdk_root framework_header arch_header patch_file
  ruby_version="$(ruby -rrbconfig -e 'print RbConfig::CONFIG["ruby_version"]')"
  ruby_major_minor="$(ruby -e 'v=RUBY_VERSION.split("."); print "#{v[0]}.#{v[1]}"')"
  sdk_root="$(xcrun --sdk macosx --show-sdk-path 2>/dev/null || true)"
  framework_header="$sdk_root/System/Library/Frameworks/Ruby.framework/Versions/$ruby_major_minor/usr/include/ruby-$ruby_version"

  if [[ -z "$sdk_root" || ! -d "$framework_header" ]]; then
    return
  fi

  arch_header="$(find "$framework_header" -maxdepth 1 -type d -name 'universal-darwin*' | head -n 1)"
  if [[ -z "$arch_header" ]]; then
    return
  fi

  patch_file="/tmp/behop-rubyhdr-patch.rb"
  cat >"$patch_file" <<EOF
require 'rbconfig'
RbConfig::CONFIG['rubyhdrdir'] = '$framework_header'
RbConfig::CONFIG['rubyarchhdrdir'] = '$arch_header'
RbConfig::MAKEFILE_CONFIG['rubyhdrdir'] = '$framework_header'
RbConfig::MAKEFILE_CONFIG['rubyarchhdrdir'] = '$arch_header'
EOF
  export RUBYOPT="-r$patch_file${RUBYOPT:+ $RUBYOPT}"
  echo "[info] Enabled macOS system Ruby header patch: $patch_file"
}

install_dependencies_if_needed() {
  if bundle check >/dev/null 2>&1; then
    echo "[info] Gem dependencies are already satisfied."
    return
  fi

  echo "[info] Installing gem dependencies into $BUNDLE_PATH"
  echo "[info] First run can take several minutes. Wait until you see Jekyll server logs."
  if ! bundle install; then
    echo "[error] bundle install failed, so preview server did not start."
    echo "[hint] If output contains 'Could not reach host ...', check network/proxy first."
    echo "[hint] You can configure a RubyGems mirror and retry:"
    echo "       bundle config set --local mirror.https://rubygems.org https://gems.ruby-china.com"
    echo "       ./scripts/local-preview.sh"
    echo "[hint] To remove this mirror later:"
    echo "       bundle config unset --local mirror.https://rubygems.org"
    exit 1
  fi
}

ensure_port_is_free() {
  if ! command -v lsof >/dev/null 2>&1; then
    return
  fi

  local listeners
  listeners="$(lsof -nP -iTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)"
  if [[ -n "$listeners" ]]; then
    echo "[error] Port $PORT is already in use."
    echo "$listeners"
    echo "[hint] Stop the process above, or run: PORT=4001 ./scripts/local-preview.sh serve"
    exit 1
  fi
}

if [[ "$MODE" == "static" ]]; then
  echo "[info] Preview URL (after startup): http://$HOST:$PORT/"
  ensure_port_is_free
  if [[ ! -f "$ROOT_DIR/_site/index.html" ]]; then
    echo "[error] _site/index.html does not exist."
    echo "[hint] Run './scripts/local-preview.sh build' first, then './scripts/local-preview.sh static'."
    exit 1
  fi
  echo "[info] Starting static preview from $ROOT_DIR/_site"
  python3 -m http.server "$PORT" --bind "$HOST" --directory "$ROOT_DIR/_site"
  exit 0
fi

enable_macos_system_ruby_header_patch_if_needed

if [[ "$MODE" == "serve" ]]; then
  echo "[info] Preview URL (after startup): http://$HOST:$PORT/"
  ensure_port_is_free
fi

install_dependencies_if_needed

if [[ "$MODE" == "build" ]]; then
  echo "[info] Building static site into $ROOT_DIR/_site"
  bundle exec jekyll build
  echo "[ok] Build complete."
  exit 0
fi

echo "[info] Starting Jekyll preview at http://$HOST:$PORT"
bundle exec jekyll serve --host "$HOST" --port "$PORT"
