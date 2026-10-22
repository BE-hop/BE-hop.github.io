/* The explicit link uses native anchor navigation; the page never scrolls itself. */
(() => {
  const hero = document.querySelector('.works-hero');
  if (hero) hero.dataset.intro = 'static';
})();
