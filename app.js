const LS_KEY = 'advent_opened_v2';
const opened = new Set(JSON.parse(localStorage.getItem(LS_KEY) || '[]'));

function saveOpened() {
  localStorage.setItem(LS_KEY, JSON.stringify([...opened]));
}

function currentDate() {
  return new Date(); 
}

function todayDay(d = currentDate()) {
  return Math.min(d.getDate(), 24);
}

function scrollToToday({ behavior = 'smooth', block = 'center' } = {}) {
  const d = todayDay();
  const id = `day-${String(d)}`;
  const el = document.getElementById(id) || document.querySelector(`.level[data-day="${d}"]`);
  if (el) el.scrollIntoView({ behavior, block });
}

document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(scrollToToday);
});