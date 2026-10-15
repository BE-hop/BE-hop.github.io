(() => {
  const hero = document.querySelector('.works-hero');
  const entry = document.querySelector('#portfolio-entry');
  const explore = document.querySelector('.works-hero__explore');
  if (!hero || !entry) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer;
  let frame;
  let cancelled = false;
  const stop = () => {
    cancelled = true;
    window.clearTimeout(timer);
    window.cancelAnimationFrame(frame);
  };
  // Never compete with a visitor's own scrolling, navigation, or focus changes.
  ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach((event) => {
    window.addEventListener(event, stop, { passive: true });
  });
  reducedMotion.addEventListener('change', stop);
  window.addEventListener('pagehide', stop);

  const reveal = () => {
    const start = window.scrollY;
    const heroBottom = hero.getBoundingClientRect().bottom + start;
    const entryBottom = entry.getBoundingClientRect().bottom + start;
    const navHeight = document.querySelector('.site-nav')?.getBoundingClientRect().height || 72;
    // Fit the complete entry while retaining at least a strip of the Hero.
    const target = Math.max(0, Math.min(entryBottom - window.innerHeight + 40, heroBottom - navHeight - 130));
    if (target <= start || reducedMotion.matches) return;
    const began = performance.now();
    const animate = (now) => {
      if (cancelled) return;
      const progress = Math.min((now - began) / 1900, 1);
      const eased = progress < .5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
      window.scrollTo({ top: start + (target - start) * eased, behavior: 'instant' });
      if (progress < 1) frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
  };
  explore?.addEventListener('click', (event) => {
    if (reducedMotion.matches) return; // Keep the native anchor fallback.
    event.preventDefault();
    cancelled = false;
    reveal();
  });
  const schedule = () => {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (cancelled || reducedMotion.matches || location.hash || window.scrollY > 8 || window.self !== window.top || navigation?.type === 'back_forward') return;
    timer = window.setTimeout(reveal, 1500);
  };
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });
})();
