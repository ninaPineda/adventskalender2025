const LS_KEY = 'advent_opened';
const LS_KEY_COINS = 'advent_coins';

const opened = new Set(JSON.parse(localStorage.getItem(LS_KEY) || '[]'));
let coins = Number(localStorage.getItem(LS_KEY_COINS) ?? '0'); // <- kein JSON.parse(0)

function saveOpened() {
  localStorage.setItem(LS_KEY, JSON.stringify([...opened]));
}
function saveCoins() {
  localStorage.setItem(LS_KEY_COINS, String(coins)); // <- keine Spread-Operator-Spielerei
}

function renderCoins() {
  const el = document.querySelector('.coins');
  if (el) el.innerHTML =
    `<img style="width:2.5rem;aspect-ratio:1;" src="assets/coin.png" alt="Coin"> <span>${coins}</span>`;
}

function addCoin(amount) {
  coins=coins+amount;
  saveCoins();
  renderCoins();
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

function getOpenedDays() {
  return [...opened].map(Number).filter(Number.isFinite).sort((a,b)=>a-b);
}
function scrollToActive({ behavior='smooth', block='center' } = {}) {
  const ods = getOpenedDays();
  const maxOpened = ods.length ? ods[ods.length] : 1;
  const id = `day-${maxOpened}`;
  const el = document.getElementById(id) || document.querySelector(`.level[data-day="${maxOpened}"]`);
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

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.level').forEach(level => {
    level.addEventListener('click', (e) => {
      const isUnlocked = level.classList.contains('unlocked') || level.classList.contains('opened');
      if (!isUnlocked) {
        e.preventDefault();
        document.getElementById('lockedPopup')?.showModal();
      }
    });
  });

  document.querySelector('.footer-today')?.addEventListener('click', scrollToToday);
  renderCoins();

  requestAnimationFrame(() => {
    updateDaysStyle();
    scrollToActive();
  });
});

window.addEventListener('load', () => setTimeout(updateDaysStyle, 0));