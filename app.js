const LS_KEY = 'advent_opened_v2';
const opened = new Set(JSON.parse(localStorage.getItem(LS_KEY) || '[]'));

function saveOpened() {
  localStorage.setItem(LS_KEY, JSON.stringify([...opened]));
}

function currentDate() {
  return new Date(); 
}

function todayDay(d = currentDate()) {
  console.log(d.getDate());
  return Math.min(d.getDate(), 24);
}

function scrollToToday({ behavior = 'smooth', block = 'center' } = {}) {
  const d = todayDay();
  const id = `day-${String(d)}`;
  const el = document.getElementById(id) || document.querySelector(`.level[data-day="${d}"]`);
  if (el) el.scrollIntoView({ behavior, block });
}

function rightSolution(day) {
  if (!opened.has(day)) {
    opened.add(day);
    saveOpened();
    updateDaysStyle();
  }

  // Konfetti-Effekt (rot/grün)
  confetti({
    particleCount: 120,
    spread: 90,
    origin: { y: 1 },
    colors: ['#962a2a', '#065308'] // deine Main-Farben
  });

  // nach 2 Sekunden zurück zur Startseite
  setTimeout(() => {
    window.location.href = "../index.html";
  }, 2000);
}

function updateDaysStyle() {
  const canOpen = todayDay();

  // Reset
  document.querySelectorAll('.level').forEach(level => {
    level.classList.remove('opened', 'unlocked');
  });

  // Geöffnete Tage markieren
  const openedDays = [...opened].map(Number).filter(n => Number.isFinite(n)).sort((a,b)=>a-b);
  openedDays.forEach(day => {
    const el = document.querySelector(`.level[data-day="${day}"]`);
    if (el) el.classList.add('opened');
  });

  // Nächsten freischalten
  const maxOpened = openedDays.length ? openedDays[openedDays.length - 1] : 0;
  const nextDay = Math.min(maxOpened + 1, canOpen);

  // Wenn nextDay nicht bereits geöffnet ist: unlocken
  if (!opened.has(nextDay)) {
    const unlockEl = document.querySelector(`.level[data-day="${nextDay}"]`);
    if (unlockEl) unlockEl.classList.add('unlocked');
  }
}

document.querySelectorAll('.level').forEach(level => {
  level.addEventListener('click', (e) => {
    const isUnlocked = level.classList.contains('unlocked') || level.classList.contains('opened');
    if (!isUnlocked) {
      e.preventDefault(); // verhindert, dass der Link öffnet
      document.getElementById('lockedPopup').showModal();
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    updateDaysStyle();
    scrollToToday();
  });
});
window.addEventListener('load', () => setTimeout(updateDaysStyle, 0));