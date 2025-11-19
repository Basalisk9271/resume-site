document.addEventListener('DOMContentLoaded', () => {
  const copyBtn = document.getElementById('copy-email');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = 'Copy email', 1600);
      } catch (err) {
        console.error('Failed to copy email', err);
        copyBtn.textContent = email;
      }
    });
  }

  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (navToggle && navLinks) {
    const closeNav = () => {
      document.body.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    };

    navToggle.addEventListener('click', () => {
      const isOpen = document.body.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeNav();
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 960) {
        closeNav();
      }
    });
  }

  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  if (anchorLinks.length) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highlightClass = 'section-focus';
    const highlightDuration = 1200;

    const highlightSection = (section) => {
      if (!section) return;
      section.classList.remove(highlightClass);
      if (section._highlightTimeout) {
        clearTimeout(section._highlightTimeout);
      }
      // force reflow to restart the animation if it was already applied
      void section.offsetWidth;
      section.classList.add(highlightClass);
      section._highlightTimeout = window.setTimeout(() => {
        section.classList.remove(highlightClass);
        section._highlightTimeout = null;
      }, highlightDuration);
    };

    anchorLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (!targetEl) return;

        event.preventDefault();
        targetEl.scrollIntoView({
          behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
          block: 'start'
        });
        const highlightDelay = prefersReducedMotion.matches ? 0 : 400;
        window.setTimeout(() => highlightSection(targetEl), highlightDelay);
      });
    });
  }

  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const emailInput = contactForm.querySelector('input[type="email"]');
    const statusEl = contactForm.querySelector('.form-status');
    const nameInput = contactForm.querySelector('input[name="name"]');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    const setStatus = (message, type) => {
      if (!statusEl) return;
      statusEl.textContent = message || '';
      if (type) {
        statusEl.dataset.status = type;
      } else {
        statusEl.removeAttribute('data-status');
      }
    };

    let validateEmail = () => {};
    if (emailInput) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      validateEmail = () => {
        const value = emailInput.value.trim();
        if (!value) {
          emailInput.setCustomValidity('Please enter your email address.');
        } else if (!emailPattern.test(value)) {
          emailInput.setCustomValidity('Enter a valid email address.');
        } else {
          emailInput.setCustomValidity('');
        }
      };
      emailInput.addEventListener('input', validateEmail);
    }

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      validateEmail();
      if (!contactForm.checkValidity()) {
        if (emailInput) emailInput.reportValidity();
        return;
      }

      const originalText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }
      setStatus('Sending...', 'info');

      const formData = new FormData(contactForm);
      const senderName = nameInput ? nameInput.value.trim() : '';
      formData.set('_subject', `${senderName || 'Portfolio visitor'} - Contact Request`);
      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        setStatus('Thanks! I’ll reply as soon as I can.', 'success');
        contactForm.reset();
      } catch (error) {
        console.error('Failed to send message', error);
        setStatus('Something went wrong. Please try again or email me directly.', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
  }

  const slides = Array.from(document.querySelectorAll('.cert-slide'));
  const prevBtn = document.getElementById('cert-prev');
  const nextBtn = document.getElementById('cert-next');
  let certIndex = 0;
  let certTimer;
  const certInterval = 7500;

  const showSlide = (index) => {
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
  };

  const resetProgress = () => {
    slides.forEach((slide, i) => {
      const fill = slide.querySelector('.cert-progress-fill');
      if (!fill) return;
      fill.style.animation = 'none';
      // force reflow to restart animation
      void fill.offsetWidth;
      if (i === certIndex) {
        fill.style.width = '0%';
        fill.style.animation = `cert-progress-fill ${certInterval}ms linear forwards`;
      } else {
        fill.style.width = '0%';
      }
    });
  };

  const nextSlide = () => {
    certIndex = (certIndex + 1) % slides.length;
    showSlide(certIndex);
    resetProgress();
  };

  const prevSlide = () => {
    certIndex = (certIndex - 1 + slides.length) % slides.length;
    showSlide(certIndex);
    resetProgress();
  };

  const startAuto = () => {
    certTimer = setInterval(nextSlide, certInterval);
  };

  if (slides.length) {
    slides.forEach(slide => {
      slide.addEventListener('click', () => {
        const link = slide.dataset.link;
        if (link && link !== '#') window.open(link, '_blank');
      });
    });
    showSlide(certIndex);
    resetProgress();
    startAuto();
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      if (certTimer) { clearInterval(certTimer); startAuto(); }
    });
    nextBtn.addEventListener('click', () => {
      nextSlide();
      if (certTimer) { clearInterval(certTimer); startAuto(); }
    });
  }
});
