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
});
