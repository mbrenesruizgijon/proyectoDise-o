/**
 * PetAdopt — main.js
 */

(function () {
  'use strict';

  // ── Navbar shadow on scroll ──────────────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  // ── Back to top ──────────────────────────────────────────
  const btnTop = document.getElementById('back-to-top');
  if (btnTop) {
    window.addEventListener('scroll', () => {
      btnTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btnTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Counter animation ────────────────────────────────────
  function animateCounter(el, target, duration = 1600) {
    let start = 0;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('es-ES');
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('es-ES');
    };
    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target, parseInt(e.target.dataset.count));
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => io.observe(c));
  }

  // ── Pet filter (mascotas.html) ───────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const petCards   = document.querySelectorAll('.pet-card-wrap');

  if (filterBtns.length && petCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const filter = btn.dataset.filter;
        let visible = 0;

        petCards.forEach(card => {
          const species = card.dataset.species;
          const show = filter === 'todos' || species === filter;
          card.style.display = show ? '' : 'none';
          card.setAttribute('aria-hidden', show ? 'false' : 'true');
          if (show) visible++;
        });

        const status = document.getElementById('filter-status');
        if (status) {
          status.textContent = `Mostrando ${visible} mascota${visible !== 1 ? 's' : ''}`;
        }
      });
    });
  }

  // ── Search (mascotas.html) ───────────────────────────────
  const searchInput = document.getElementById('pet-search');
  if (searchInput && petCards.length) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      petCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }

  // ── Bootstrap form validation (adoptar.html) ─────────────
  const form = document.getElementById('adoption-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
        const firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
      } else {
        e.preventDefault();
        showSuccessMessage();
      }
      form.classList.add('was-validated');
    }, false);

    // Live validation feedback
    form.querySelectorAll('.form-control, .form-select, .form-check-input').forEach(input => {
      input.addEventListener('blur', () => {
        if (form.classList.contains('was-validated')) return;
        input.classList.toggle('is-valid',   input.checkValidity());
        input.classList.toggle('is-invalid', !input.checkValidity());
      });
    });
  }

  function showSuccessMessage() {
    const successEl = document.getElementById('form-success');
    const formEl    = document.getElementById('adoption-form');
    if (successEl && formEl) {
      formEl.style.display = 'none';
      successEl.removeAttribute('hidden');
      successEl.focus();
    }
  }

  // ── Smooth scroll for anchor links ───────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── AOS init (if available) ──────────────────────────────
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 600, once: true, offset: 80 });
  }

})();
