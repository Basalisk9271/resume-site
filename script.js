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
