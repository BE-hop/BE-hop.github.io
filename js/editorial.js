/* Shared bilingual text and native links; content is already present in the HTML. */
(() => {
  let lang = 'en';
  try {lang = localStorage.getItem('portfolioLang') || localStorage.getItem('blogLang') || localStorage.getItem('behopAiLang') || 'en';} catch (_) {}
  const apply = (next, persist = false) => {
    lang = next === 'zh' ? 'zh' : 'en';
    document.documentElement.lang = lang;
    if (persist) {
      try {['portfolioLang','blogLang','behopAiLang'].forEach(key => localStorage.setItem(key,lang));} catch (_) {}
    }
    document.querySelectorAll('[data-zh][data-en], [data-i18n-zh][data-i18n-en]').forEach(node => {
      if (node.isContentEditable || node.hasAttribute('data-behop-editor-key') || node === document.activeElement || node.children.length) return;
      const value = node.getAttribute('data-' + lang) ?? node.getAttribute('data-i18n-' + lang);
      if (value !== null) node.textContent = value;
    });
    document.querySelectorAll('[data-lang-href-' + lang + ']').forEach(node => {node.href = node.getAttribute('data-lang-href-' + lang);});
    document.querySelectorAll('[data-lang]').forEach(button => button.classList.toggle('is-active',button.dataset.lang === lang));
    document.dispatchEvent(new CustomEvent('portfolio:languagechange',{detail:{lang}}));
  };
  document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click',() => apply(button.dataset.lang,true)));
  window.addEventListener('storage',event => {if (['portfolioLang','blogLang','behopAiLang'].includes(event.key)) apply(event.newValue);});
  apply(lang);
})();
