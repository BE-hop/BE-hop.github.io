# AItalk Quick Upload

After the forum list was switched to dynamic rendering, adding a new article only requires updating one data file:

- `/Users/mac/Documents/BE-hop.github.io/js/forum-data.js`

## 1. Add a topic object

Append one object to the `topics` array with:

- `slug` (unique)
- `category` (`ai` for AItalk)
- `tags` (include `aitalk` so detail page uses dialogue layout)
- `title` / `excerpt` (`en` + `zh`)
- `content` blocks (`p`, `h2`, `qa`, `ul`)
- For long answers, use `answerBlocks` in each `qa` item (recommended)

Template:

```js
{
  slug: "your-topic-slug",
  category: "ai",
  tags: ["aitalk"],
  author: {
    name: "BEhop",
    initials: "BH",
    role: { en: "AItalk Editor", zh: "AItalk 编辑" },
  },
  stats: { replies: 0, views: 0 },
  date: "2026-02-06T10:00:00Z",
  readTime: { en: "6 min", zh: "6 分钟" },
  title: {
    en: "AI Talk: ...",
    zh: "AI Talk：...",
  },
  excerpt: {
    en: "Short summary...",
    zh: "简短摘要...",
  },
  content: [
    {
      type: "qa",
      items: [
        {
          question: {
            zh: "短问题（建议一句话）",
          },
          answerBlocks: [
            { type: "p", zh: "长回答第一段..." },
            { type: "h2", zh: "小标题" },
            { type: "p", zh: "长回答第二段..." },
            {
              type: "ul",
              zh: ["要点 1", "要点 2", "要点 3"],
            },
          ],
        },
        {
          question: {
            zh: "第二个短问题（这就是你说的每天固定两次问答）",
          },
          answerBlocks: [
            { type: "p", zh: "第二个问题的长回答..." },
          ],
        },
      ],
    },
  ],
}
```

## 2. Build and preview

```bash
cd /Users/mac/Documents/BE-hop.github.io
bundle exec jekyll build
bundle exec jekyll serve --host 127.0.0.1 --port 4000
```

Open:

- `http://localhost:4000/forum/`

Optional direct check:

- `http://localhost:4000/forum/topic/?topic=your-topic-slug`

## 3. Publish

```bash
git add -A
git commit -m "Add new AItalk topic"
git push
```
