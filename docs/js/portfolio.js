/* ==========================================================================
   Adnan Mansha — Portfolio
   Vanilla JS, no dependencies. Each feature is an isolated init function so a
   failure in one never takes the rest of the page down.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  /* ---------- Theme (dark default, persisted, follows OS until chosen) ---------- */
  function initTheme() {
    var root = document.documentElement;
    var btn = $('[data-theme-toggle]');
    var KEY = 'am-theme';

    var stored = null;
    try { stored = localStorage.getItem(KEY); } catch (e) { /* private mode */ }

    if (stored === 'light' || stored === 'dark') {
      root.setAttribute('data-theme', stored);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      root.setAttribute('data-theme', 'light');
    }

    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      btn.setAttribute('aria-label', 'Switch to ' + (next === 'light' ? 'dark' : 'light') + ' theme');
      try { localStorage.setItem(KEY, next); } catch (e) { /* ignore */ }
    });
  }

  /* ---------- Mobile navigation ---------- */
  function initNav() {
    var toggle = $('[data-nav-toggle]');
    var links = $('#nav-links');
    if (!toggle || !links) return;

    function close() {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var items = $$('[data-reveal]');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
        setTimeout(function () { el.classList.add('is-visible'); }, delay);
        observer.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Active nav link while scrolling ---------- */
  function initScrollSpy() {
    var sections = $$('section[id]');
    var links = $$('#nav-links a[href^="#"]');
    if (!sections.length || !links.length || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---------- Hero role typewriter ---------- */
  function initTyping() {
    var el = $('[data-typing]');
    if (!el) return;

    var phrases;
    try { phrases = JSON.parse(el.getAttribute('data-typing')); } catch (e) { return; }
    if (!phrases || !phrases.length) return;

    if (reduceMotion) { el.textContent = phrases[0]; return; }

    var caret = document.createElement('span');
    caret.className = 'caret';
    caret.setAttribute('aria-hidden', 'true');
    var out = document.createElement('span');
    el.textContent = '';
    el.append(out, caret);

    var pi = 0, ci = 0, deleting = false;

    (function tick() {
      var phrase = phrases[pi];
      ci += deleting ? -1 : 1;
      out.textContent = phrase.slice(0, ci);

      var wait = deleting ? 35 : 65;
      if (!deleting && ci === phrase.length) { deleting = true; wait = 1900; }
      else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; wait = 350; }

      setTimeout(tick, wait);
    })();
  }

  /* ---------- Animated stat counters ---------- */
  function initCounters() {
    var nums = $$('[data-count]');
    if (!nums.length) return;

    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      if (reduceMotion) { el.textContent = target + suffix; return; }

      var start = performance.now();
      var dur = 1200;
      (function frame(now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(frame);
      })(start);
    }

    if (!('IntersectionObserver' in window)) { nums.forEach(run); return; }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        run(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    nums.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Slider / carousel ---------- */
  function initSliders() {
    $$('[data-slider]').forEach(function (slider) {
      var track = $('[data-slider-track]', slider);
      var slides = $$('.slide', track);
      var prev = $('[data-slider-prev]', slider);
      var next = $('[data-slider-next]', slider);
      var dotsBox = $('[data-slider-dots]', slider);
      if (!track || !slides.length) return;

      var index = 0;
      var perView = 1;
      var maxIndex = 0;
      var dots = [];

      function measure() {
        var w = window.innerWidth;
        perView = w >= 1000 ? 3 : w >= 680 ? 2 : 1;
        track.style.setProperty('--per-view', perView);
        slides.forEach(function (s) { s.style.setProperty('--per-view', perView); });
        maxIndex = Math.max(0, slides.length - perView);
        index = Math.min(index, maxIndex);
      }

      function buildDots() {
        if (!dotsBox) return;
        dotsBox.textContent = '';
        dots = [];
        for (var i = 0; i <= maxIndex; i++) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'dot';
          b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
          b.addEventListener('click', (function (target) {
            return function () { go(target); };
          })(i));
          dotsBox.appendChild(b);
          dots.push(b);
        }
      }

      function paint() {
        track.style.transform = 'translateX(' + (-index * (100 / perView)) + '%)';
        if (prev) prev.disabled = index === 0;
        if (next) next.disabled = index >= maxIndex;
        dots.forEach(function (d, i) { d.classList.toggle('is-active', i === index); });
        slides.forEach(function (s, i) {
          var visible = i >= index && i < index + perView;
          // Keep off-screen slides out of the tab order.
          $$('a, button', s).forEach(function (f) {
            if (visible) f.removeAttribute('tabindex');
            else f.setAttribute('tabindex', '-1');
          });
        });
      }

      function go(to) {
        index = Math.max(0, Math.min(to, maxIndex));
        paint();
      }

      if (prev) prev.addEventListener('click', function () { go(index - 1); });
      if (next) next.addEventListener('click', function () { go(index + 1); });

      slider.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { go(index - 1); }
        else if (e.key === 'ArrowRight') { go(index + 1); }
      });

      // Touch / pointer swipe
      var startX = null;
      slider.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
      }, { passive: true });
      slider.addEventListener('touchend', function (e) {
        if (startX === null) return;
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
        startX = null;
      });

      var resizeTimer;
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          var before = perView;
          measure();
          if (before !== perView) buildDots();
          paint();
        }, 120);
      });

      measure();
      buildDots();
      paint();
    });
  }

  /* ---------- Modal popups ---------- */
  function initModal() {
    var modal = $('#modal');
    if (!modal) return;

    var dialog = $('.modal-dialog', modal);
    var titleEl = $('[data-modal-title]', modal);
    var eyebrowEl = $('[data-modal-eyebrow]', modal);
    var bodyEl = $('[data-modal-body]', modal);
    var lastFocused = null;

    function open(trigger) {
      var source = document.getElementById(trigger.getAttribute('data-modal'));
      if (!source) return;

      lastFocused = trigger;
      titleEl.textContent = trigger.getAttribute('data-modal-title') || '';
      eyebrowEl.textContent = trigger.getAttribute('data-modal-eyebrow') || '';
      bodyEl.innerHTML = source.innerHTML;

      modal.classList.add('is-open');
      modal.removeAttribute('aria-hidden');
      document.body.classList.add('is-locked');

      var first = $('button, [href], input, select, textarea', dialog);
      (first || dialog).focus();
    }

    function close() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      bodyEl.innerHTML = '';
      if (lastFocused) { lastFocused.focus(); lastFocused = null; }
    }

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-modal]');
      if (trigger) { e.preventDefault(); open(trigger); return; }
      if (e.target.closest('[data-modal-close]') || e.target === modal) close();
    });

    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('is-open')) return;

      if (e.key === 'Escape') { close(); return; }

      // Trap focus inside the dialog.
      if (e.key !== 'Tab') return;
      var focusable = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', dialog)
        .filter(function (el) { return el.offsetParent !== null; });
      if (!focusable.length) return;

      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---------- Copy to clipboard ---------- */
  function initCopy() {
    var toast = $('#copy-toast');

    function flash(msg) {
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add('is-shown');
      clearTimeout(toast._t);
      toast._t = setTimeout(function () { toast.classList.remove('is-shown'); }, 2000);
    }

    $$('[data-copy]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var value = btn.getAttribute('data-copy');
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(value).then(
            function () { flash('Copied: ' + value); },
            function () { flash('Press Ctrl+C to copy'); }
          );
        } else {
          flash(value);
        }
      });
    });
  }

  /* ---------- Back to top ---------- */
  function initToTop() {
    var btn = $('#to-top');
    if (!btn) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        btn.classList.toggle('is-shown', window.scrollY > 600);
        ticking = false;
      });
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Boot ---------- */
  function boot() {
    [initTheme, initNav, initReveal, initScrollSpy, initTyping, initCounters,
     initSliders, initModal, initCopy, initToTop].forEach(function (fn) {
      try { fn(); } catch (err) {
        if (window.console) console.error('[portfolio] ' + fn.name + ' failed:', err);
      }
    });

    // Stamp the current year wherever it's needed.
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
