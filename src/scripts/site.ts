const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function initReveal() {
  const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!items.length) return;
  if (!('IntersectionObserver' in window) || reducedMotion.matches) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  items.forEach((item) => observer.observe(item));
}

function initMenus() {
  document.querySelectorAll<HTMLElement>('[data-menu]').forEach((root) => {
    const button = root.querySelector<HTMLButtonElement>('[data-menu-button]');
    const panel = root.querySelector<HTMLElement>('[data-menu-panel]');
    if (!button || !panel) return;

    const setOpen = (open: boolean, restoreFocus = false) => {
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      root.toggleAttribute('data-open', open);
      if (!open && restoreFocus) button.focus();
    };

    button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
    root.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && root.hasAttribute('data-open')) setOpen(false, true);
    });
    document.addEventListener('click', (event) => {
      if (root.hasAttribute('data-open') && !root.contains(event.target as Node)) setOpen(false);
    });
    panel.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
    window.matchMedia('(min-width: 961px)').addEventListener('change', (event) => {
      if (event.matches) setOpen(false);
    });
  });
}

function initHeaders() {
  const headers = document.querySelectorAll<HTMLElement>('[data-header]');
  if (!headers.length) return;
  const update = () => headers.forEach((header) => header.classList.toggle('is-scrolled', window.scrollY > 8));
  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initCarousels() {
  document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((root) => {
    const track = root.querySelector<HTMLElement>('[data-carousel-track]');
    const prev = root.querySelector<HTMLButtonElement>('[data-carousel-prev]');
    const next = root.querySelector<HTMLButtonElement>('[data-carousel-next]');
    if (!track || !prev || !next) return;

    const step = () => {
      const card = track.querySelector<HTMLElement>(':scope > *');
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card ? card.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
    };
    const update = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
    };
    const behavior: ScrollBehavior = reducedMotion.matches ? 'auto' : 'smooth';
    prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior }));
    next.addEventListener('click', () => track.scrollBy({ left: step(), behavior }));
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });
}

function initTabs() {
  document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((root) => {
    const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls') ?? ''));

    const select = (index: number, focus = false) => {
      tabs.forEach((tab, i) => {
        const active = i === index;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        const panel = panels[i];
        if (panel) panel.hidden = !active;
      });
      if (focus) tabs[index]?.focus();
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(index));
      tab.addEventListener('keydown', (event) => {
        const keys: Record<string, number> = {
          ArrowRight: (index + 1) % tabs.length,
          ArrowDown: (index + 1) % tabs.length,
          ArrowLeft: (index - 1 + tabs.length) % tabs.length,
          ArrowUp: (index - 1 + tabs.length) % tabs.length,
          Home: 0,
          End: tabs.length - 1,
        };
        const target = keys[event.key];
        if (target === undefined) return;
        event.preventDefault();
        select(target, true);
      });
    });
  });
}

function initCrosshairs() {
  document.querySelectorAll<HTMLElement>('[data-crosshair]').forEach((root) => {
    const readout = root.querySelector<HTMLElement>('[data-crosshair-readout]');
    const [north, south] = (root.dataset.lat ?? '13.16,13.00').split(',').map(Number);
    const [west, east] = (root.dataset.lon ?? '80.16,80.36').split(',').map(Number);
    const defaultText = readout?.textContent ?? '';
    let frame = 0;

    root.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = root.getBoundingClientRect();
        const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
        const y = Math.min(Math.max(event.clientY - rect.top, 0), rect.height);
        root.style.setProperty('--cx', `${x}px`);
        root.style.setProperty('--cy', `${y}px`);
        root.classList.add('is-tracking');
        if (readout) {
          const lat = north + ((south - north) * y) / rect.height;
          const lon = west + ((east - west) * x) / rect.width;
          readout.textContent = `${lat.toFixed(4)}° N  ${lon.toFixed(4)}° E`;
        }
      });
    });
    root.addEventListener('pointerleave', () => {
      cancelAnimationFrame(frame);
      root.classList.remove('is-tracking');
      if (readout) readout.textContent = defaultText;
    });
  });
}

function initToc() {
  document.querySelectorAll<HTMLElement>('[data-toc]').forEach((toc) => {
    const links = Array.from(toc.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
    const headings = links.map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))));
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      let active = 0;
      headings.forEach((heading, i) => {
        if (heading && heading.getBoundingClientRect().top <= line) active = i;
      });
      // The last sections can be too short to reach the line, so the page bottom selects the last entry.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) active = links.length - 1;
      links.forEach((link, i) => link.toggleAttribute('data-active', i === active));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
  });
}

initReveal();
initMenus();
initHeaders();
initCarousels();
initTabs();
initCrosshairs();
initToc();
