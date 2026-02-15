# AI Blog Publish Guide (BE-hop.github.io)

This file is a deterministic playbook for AI agents publishing blog posts in this repo.

## Scope

- Target site: Jekyll blog in this repository.
- Post location: `_posts/`.
- Supported languages for a bilingual post: Chinese (`lang: zh`) + English (`lang: en`).

## MUST Rules

1. Always publish bilingual posts as two files:
   - `YYYY-MM-DD-<slug>.md` for Chinese.
   - `YYYY-MM-DD-<slug>-en.md` for English.
2. Both files must share the same date and topic.
3. Front matter must include:
   - `layout: post`
   - `title`
   - `subtitle`
   - `date`
   - `author: liu.ruyuan`
   - `lang` (`zh` or `en`)
   - `tags`
4. Add cross-link lines near top of each article:
   - Chinese file includes English URL hint.
   - English file includes Chinese URL hint.
5. Keep structure aligned across both languages (same sections/order).

## SHOULD Rules

1. Keep style concise and technical when source is technical.
2. Add 1-3 meaningful emojis in title/subtitle/section headings (not excessive).
3. Preserve code blocks and commands exactly when translating.
4. Prefer ASCII punctuation in YAML and file names.
5. Do not change unrelated files.

## Front Matter Templates

```yaml
---
layout: post
title: "中文标题"
subtitle: "中文副标题"
date: YYYY-MM-DD
author: liu.ruyuan
lang: zh
tags: [标签1, 标签2, 标签3]
---
```

```yaml
---
layout: post
title: "English Title"
subtitle: "English subtitle"
date: YYYY-MM-DD
author: liu.ruyuan
lang: en
tags: [tag1, tag2, tag3]
---
```

## Recommended Workflow

1. Read source article and identify key sections.
2. Create Chinese post under `_posts/`.
3. Create matching English post with `-en` suffix.
4. Add bilingual cross-links near top of both posts.
5. Build site:

```bash
RUBYOPT='-r/tmp/rubyhdr_patch.rb' \
BUNDLE_PATH=/tmp/behop-bundle \
BUNDLE_USER_HOME=/tmp/bundle-home \
bundle exec jekyll build
```

6. Preview static output (from `_site`):

```bash
python3 -m http.server 4000
```

7. Open:
   - `http://127.0.0.1:4000/blog/`
   - `http://127.0.0.1:4000/blog/en/`
   - direct post URLs

## Validation Checklist

- [ ] Both files exist in `_posts/` with correct naming.
- [ ] `lang: zh` and `lang: en` are set correctly.
- [ ] Title/subtitle/date/author/tags are present in both.
- [ ] Section structure matches between languages.
- [ ] Emojis are present but controlled (1-3 primary placements).
- [ ] Site build succeeds without post-format errors.
- [ ] New post appears in both Chinese and English blog indexes.

## Optional Quick Checks

```bash
rg -n "^lang: (zh|en)$" _posts/2026-02-15-ru-lineart-project-progress*.md
rg -n "^title:|^subtitle:|^date:|^author:" _posts/2026-02-15-ru-lineart-project-progress*.md
rg -n "ru-lineart-project-progress" _site/blog/index.html _site/blog/en/index.html
```

## Final Delivery Format (for AI response)

Include:

1. Changed file paths.
2. Preview URL(s).
3. Whether build/preview checks passed.
4. Any blockers if commands could not run.
