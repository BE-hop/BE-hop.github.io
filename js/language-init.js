/* Restore preferred text as soon as available; never block parsing or hide the body. */
(() => {
  let lang = 'en';
  try { lang = localStorage.getItem('portfolioLang') || localStorage.getItem('behopAiLang') || localStorage.getItem('blogLang') || 'en'; } catch (_) {}
  if (!['en', 'zh'].includes(lang)) lang = 'en';
  document.documentElement.lang = lang;
  const apply = element => {
    if (!(element instanceof Element)) return;
    if (element.isContentEditable || element.hasAttribute('data-behop-editor-key') || element === document.activeElement) return;
    const value = element.getAttribute('data-' + lang) || element.getAttribute('data-i18n-' + lang);
    if (value && !element.children.length && element.textContent !== value) element.textContent = value;
  };
  const translate = node => {
    if (!(node instanceof Element)) { apply(node.parentElement); return; }
    apply(node);
    node.querySelectorAll('[data-en][data-zh], [data-i18n-en][data-i18n-zh]').forEach(apply);
  };
  const observer = new MutationObserver(records => records.forEach(record => {
    record.addedNodes.forEach(translate);
  }));
  observer.observe(document.documentElement, { childList: true, subtree: true });
  const finish = () => {translate(document.documentElement);observer.disconnect();};
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', finish, { once: true });
  else finish();
})();
