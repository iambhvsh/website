/* ── Dynamic year ─────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── Keyboard accessibility for cards ─────────────────────── */
document.querySelectorAll('.link-card').forEach(card => {
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});
