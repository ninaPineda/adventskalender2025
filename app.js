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
  // erst alle Level zurücksetzen
  document.querySelectorAll('.level').forEach(level => {
    level.classList.remove("opened", "unlocked");
  });

  // alle geöffneten als "opened"
  opened.forEach(day => {
    const level = document.querySelector(`.level[data-day="${day}"]`);
    if (level) level.classList.add("opened");
  });

  // den neuesten (größten) Tag bestimmen
  if (opened.size > 0) {
    const days = Array.from(opened).sort((a, b) => a - b);
    const latestOpenedDay = days[days.length - 1];
    const newDay = parseInt(latestOpenedDay) + 1;

    if(latestOpenedDay < todayDay()){
    const newestLevel = document.querySelector(`.level[data-day="${newDay}"]`);
    console.log(newDay);
    if (newestLevel) newestLevel.classList.add("unlocked");
  
    }
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
  requestAnimationFrame(scrollToToday);
  updateDaysStyle();
});