const colorWithAlpha = (variableName) => ({ opacityValue }) => {
  const numericOpacity = Number(opacityValue)
  if (!Number.isFinite(numericOpacity)) {
    return `var(${variableName})`
  }

  const percentage = Math.round(numericOpacity * 10000) / 100
  return `color-mix(in oklab, var(${variableName}) ${percentage}%, transparent)`
}

module.exports = {
  content: [
    "./*.html",
    "./{about,archive,blog,behop-ai-product,forum,works}/**/*.html",
    "./_includes/**/*.html",
    "./_layouts/**/*.html",
    "./_posts/**/*.{md,html}",
    "./_projects/**/*.{md,html}",
    "./_ai_products/**/*.{md,html}",
    "./_ai_gallery/**/*.{md,html}",
    "./js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        background: colorWithAlpha("--background"),
        foreground: colorWithAlpha("--foreground"),
        card: colorWithAlpha("--card"),
        "card-foreground": colorWithAlpha("--card-foreground"),
        popover: colorWithAlpha("--popover"),
        "popover-foreground": colorWithAlpha("--popover-foreground"),
        primary: colorWithAlpha("--primary"),
        "primary-foreground": colorWithAlpha("--primary-foreground"),
        secondary: colorWithAlpha("--secondary"),
        "secondary-foreground": colorWithAlpha("--secondary-foreground"),
        muted: colorWithAlpha("--muted"),
        "muted-foreground": colorWithAlpha("--muted-foreground"),
        accent: colorWithAlpha("--accent"),
        "accent-foreground": colorWithAlpha("--accent-foreground"),
        border: colorWithAlpha("--border"),
        input: colorWithAlpha("--input"),
        ring: colorWithAlpha("--ring"),
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Manrope", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
}
