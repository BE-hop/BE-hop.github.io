/* Shared renderer: browser enhancement and build-time static reading use identical blocks. */
(() => {
  const pickLang = (value, lang) => !value || typeof value !== "object" ? value : value[lang] || value.en || value.zh || ""
  const qaRoleLabels = { question: { en: "Question", zh: "提问" }, answer: { en: "Answer", zh: "回答" } }
  const createParagraph = (text, className = "text-sm leading-relaxed text-foreground/90") => {
    const paragraph = document.createElement("p")
    paragraph.className = className
    paragraph.textContent = text
    return paragraph
  }

  const createRichParagraph = (html, className = "text-sm leading-relaxed text-foreground/90") => {
    const paragraph = document.createElement("p")
    paragraph.className = className
    paragraph.innerHTML = html
    return paragraph
  }

  const createHeading = (text, className = "text-xl font-semibold text-foreground") => {
    const heading = document.createElement("h2")
    heading.className = className
    heading.textContent = text
    return heading
  }

  const createBulletList = (items, options = {}) => {
    const {
      listClass = "space-y-2 text-sm text-foreground",
      itemClass = "flex items-start gap-2",
      dotClass = "mt-1 h-1.5 w-1.5 rounded-full bg-primary",
    } = options

    const list = document.createElement("ul")
    list.className = listClass

    items.forEach((item) => {
      const li = document.createElement("li")
      li.className = itemClass

      const dot = document.createElement("span")
      dot.className = dotClass

      const textNode = document.createElement("span")
      textNode.textContent = item

      li.append(dot, textNode)
      list.appendChild(li)
    })

    return list
  }

  const pickLangArray = (value, lang) => {
    if (Array.isArray(value)) return value
    if (!value || typeof value !== "object") return []
    const localized = value[lang] || value.en || value.zh
    return Array.isArray(localized) ? localized : []
  }

  const pickLangMatrix = (value, lang) => {
    const localized = pickLang(value, lang)
    if (!Array.isArray(localized)) return []
    return localized.filter((row) => Array.isArray(row))
  }

  const createDivider = (className) => {
    const divider = document.createElement("hr")
    divider.className = className
    return divider
  }

  const createQuoteBlock = (lines, className = "forum-insight-quote", lineClassName = "forum-insight-quote__line") => {
    const quote = document.createElement("blockquote")
    quote.className = className
    lines.forEach((line) => {
      const lineNode = document.createElement("p")
      lineNode.className = lineClassName
      lineNode.innerHTML = line
      quote.appendChild(lineNode)
    })
    return quote
  }

  const createInsightTable = (headers, rows) => {
    const wrap = document.createElement("div")
    wrap.className = "forum-insight-table-wrap"

    const table = document.createElement("table")
    table.className = "forum-insight-table"

    if (Array.isArray(headers) && headers.length) {
      const thead = document.createElement("thead")
      const tr = document.createElement("tr")
      headers.forEach((header) => {
        const th = document.createElement("th")
        th.textContent = header
        tr.appendChild(th)
      })
      thead.appendChild(tr)
      table.appendChild(thead)
    }

    const tbody = document.createElement("tbody")
    rows.forEach((row) => {
      const tr = document.createElement("tr")
      row.forEach((cell) => {
        const td = document.createElement("td")
        td.textContent = cell
        tr.appendChild(td)
      })
      tbody.appendChild(tr)
    })
    table.appendChild(tbody)
    wrap.appendChild(table)

    return wrap
  }

  const appendInsightNode = (container, lastSection, node) => {
    if (lastSection) {
      lastSection.appendChild(node)
      return
    }

    const section = document.createElement("section")
    section.className = "forum-insight-section"
    section.appendChild(node)
    container.appendChild(section)
  }

  const renderQaAnswerBlock = (container, block, lang) => {
    if (!block || typeof block !== "object") return
    const value = pickLang(block, lang)
    if (!value && !Array.isArray(block?.en) && !Array.isArray(block?.zh)) return

    if (block.type === "h2" || block.type === "h3") {
      const heading = document.createElement("h3")
      heading.className = "forum-qa-answer__heading"
      heading.textContent = value
      container.appendChild(heading)
      return
    }

    if (block.type === "ul") {
      const items = pickLangArray(block, lang)
      if (!items.length) return
      container.appendChild(
        createBulletList(items, {
          listClass: "forum-qa-answer__list",
          itemClass: "forum-qa-answer__list-item",
          dotClass: "forum-qa-answer__dot",
        })
      )
      return
    }

    container.appendChild(createParagraph(value, "forum-qa-answer__paragraph"))
  }

  const renderQaBlock = (container, block, lang) => {
    const thread = document.createElement("section")
    thread.className = "forum-qa-thread"

    const items = Array.isArray(block?.items) ? block.items : []

    items.forEach((item, index) => {
      const questionText = pickLang(item?.question, lang)
      const answerText = pickLang(item?.answer, lang)
      const answerBlocks = pickLangArray(item?.answerBlocks, lang)
      if (!questionText && !answerText && !answerBlocks.length) return

      const pair = document.createElement("article")
      pair.className = "forum-qa-pair"

      const questionCard = document.createElement("div")
      questionCard.className = "forum-qa-question"

      const questionMeta = document.createElement("div")
      questionMeta.className = "forum-qa-question__meta"

      const questionRole = document.createElement("span")
      questionRole.className = "forum-qa-question__role"
      questionRole.textContent = pickLang(qaRoleLabels.question, lang)

      const questionIndex = document.createElement("span")
      questionIndex.className = "forum-qa-question__index"
      questionIndex.textContent = `Q${index + 1}`

      questionMeta.append(questionRole, questionIndex)
      questionCard.appendChild(questionMeta)

      if (questionText) {
        const questionBody = document.createElement("p")
        questionBody.className = "forum-qa-question__text"
        questionBody.textContent = questionText
        questionCard.appendChild(questionBody)
      }

      const answerCard = document.createElement("div")
      answerCard.className = "forum-qa-answer"

      const answerMeta = document.createElement("div")
      answerMeta.className = "forum-qa-answer__meta"
      answerMeta.textContent = pickLang(qaRoleLabels.answer, lang)
      answerCard.appendChild(answerMeta)

      const answerBody = document.createElement("div")
      answerBody.className = "forum-qa-answer__body"

      if (answerText) {
        answerBody.appendChild(createParagraph(answerText, "forum-qa-answer__paragraph"))
      }

      answerBlocks.forEach((answerBlock) => {
        renderQaAnswerBlock(answerBody, answerBlock, lang)
      })

      answerCard.appendChild(answerBody)
      pair.append(questionCard, answerCard)
      thread.appendChild(pair)
    })

    if (!thread.children.length) {
      const empty = document.createElement("div")
      empty.className = "forum-dialogue-empty"
      empty.textContent =
        lang === "zh"
          ? "当前对话内容为空，请在数据中补充 qa.items。"
          : "No dialogue items found. Add qa.items in the topic data."
      thread.appendChild(empty)
    }

    container.appendChild(thread)
  }

  const renderArticleBlock = (container, block, lang) => {
    if (block.type === "qa") {
      renderQaBlock(container, block, lang)
      return
    }

    if (block.type === "hr") {
      container.appendChild(createDivider("forum-insight-divider"))
      return
    }

    const blockValue = pickLang(block, lang)
    if (!blockValue && !Array.isArray(block?.en) && !Array.isArray(block?.zh) && !block.lines && !block.rows) return

    if (block.type === "h2") {
      container.appendChild(createHeading(blockValue))
      return
    }

    if (block.type === "ul") {
      const items = pickLang(block, lang) || []
      if (items.length) container.appendChild(createBulletList(items))
      return
    }

    if (block.type === "quote") {
      const lines = pickLangArray(block.lines, lang)
      if (!lines.length) return
      container.appendChild(createQuoteBlock(lines))
      return
    }

    if (block.type === "table") {
      const headers = pickLangArray(block.headers, lang)
      const rows = pickLangMatrix(block.rows, lang)
      if (!headers.length || !rows.length) return
      container.appendChild(createInsightTable(headers, rows))
      return
    }

    if (block.type === "p-rich") {
      container.appendChild(createRichParagraph(blockValue))
      return
    }

    container.appendChild(createParagraph(blockValue))
  }

  const renderDialogueBlock = (container, block, lang) => {
    if (block.type === "qa") {
      renderQaBlock(container, block, lang)
      return
    }

    if (block.type === "hr") {
      container.appendChild(createDivider("forum-insight-divider"))
      return
    }

    const blockValue = pickLang(block, lang)
    if (!blockValue && !Array.isArray(block?.en) && !Array.isArray(block?.zh) && !block.lines && !block.rows) return

    if (block.type === "h2") {
      container.appendChild(
        createHeading(blockValue, "text-base md:text-lg font-semibold text-foreground/90 tracking-wide")
      )
      return
    }

    if (block.type === "ul") {
      const items = pickLang(block, lang) || []
      if (items.length) {
        container.appendChild(
          createBulletList(items, {
            listClass: "space-y-2 text-sm text-foreground/90",
            itemClass: "flex items-start gap-2",
            dotClass: "mt-1.5 h-1.5 w-1.5 rounded-full bg-accent",
          })
        )
      }
      return
    }

    if (block.type === "quote") {
      const lines = pickLangArray(block.lines, lang)
      if (!lines.length) return
      container.appendChild(createQuoteBlock(lines))
      return
    }

    if (block.type === "table") {
      const headers = pickLangArray(block.headers, lang)
      const rows = pickLangMatrix(block.rows, lang)
      if (!headers.length || !rows.length) return
      container.appendChild(createInsightTable(headers, rows))
      return
    }

    if (block.type === "p-rich") {
      container.appendChild(createRichParagraph(blockValue, "forum-dialogue-note text-sm leading-relaxed"))
      return
    }

    container.appendChild(createParagraph(blockValue, "forum-dialogue-note text-sm leading-relaxed"))
  }

  const renderInsightBlock = (container, block, lang) => {
    if (block.type === "qa") {
      renderQaBlock(container, block, lang)
      return
    }

    if (block.type === "hr") {
      container.appendChild(createDivider("forum-insight-divider"))
      return
    }

    const blockValue = pickLang(block, lang)
    const hasArrayValue = Array.isArray(block?.en) || Array.isArray(block?.zh)
    const hasStructuredArray = Array.isArray(pickLang(block?.lines, lang)) || Array.isArray(pickLang(block?.rows, lang))
    if (!blockValue && !hasArrayValue && !hasStructuredArray) return

    if (block.type === "h2") {
      const section = document.createElement("section")
      section.className = "forum-insight-section"
      section.appendChild(createHeading(blockValue, "forum-insight-section__title"))
      container.appendChild(section)
      return
    }

    const lastSection =
      container.lastElementChild && container.lastElementChild.classList.contains("forum-insight-section")
        ? container.lastElementChild
        : null

    if (block.type === "ul") {
      const items = pickLangArray(block, lang)
      if (!items.length) return

      const list = createBulletList(items, {
        listClass: "forum-insight-list",
        itemClass: "forum-insight-list__item",
        dotClass: "forum-insight-list__dot",
      })

      appendInsightNode(container, lastSection, list)
      return
    }

    if (block.type === "quote") {
      const lines = pickLangArray(block.lines, lang)
      if (!lines.length) return
      appendInsightNode(container, lastSection, createQuoteBlock(lines))
      return
    }

    if (block.type === "table") {
      const headers = pickLangArray(block.headers, lang)
      const rows = pickLangMatrix(block.rows, lang)
      if (!headers.length || !rows.length) return
      appendInsightNode(container, lastSection, createInsightTable(headers, rows))
      return
    }

    const paragraphClass = container.childElementCount === 0 ? "forum-insight-lead" : "forum-insight-paragraph"
    const paragraph =
      block.type === "p-rich"
        ? createRichParagraph(blockValue, paragraphClass)
        : createParagraph(blockValue, paragraphClass)

    appendInsightNode(container, lastSection, paragraph)
  }

  window.FORUM_RENDER_TOPIC = (container, topic, lang, layout) => {
    container.innerHTML = ""
    container.className = layout === "dialogue" ? "forum-dialogue" : layout === "insight" ? "forum-insight" : "forum-article space-y-6"
    ;(topic.content || []).forEach(block => {
      if (layout === "dialogue") renderDialogueBlock(container, block, lang)
      else if (layout === "insight") renderInsightBlock(container, block, lang)
      else renderArticleBlock(container, block, lang)
    })
  }
})()
