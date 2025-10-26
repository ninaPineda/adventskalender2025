const LS_KEY = 'advent_opened';
const LS_KEY_COINS = 'advent_coins';

const opened = new Set(JSON.parse(localStorage.getItem(LS_KEY) || '[]'));
let coins = new Number(localStorage.getItem(LS_KEY_COINS) ?? '9');

function saveOpened() {
  localStorage.setItem(LS_KEY, JSON.stringify([...opened]));
}
function saveCoins() {
  localStorage.setItem(LS_KEY_COINS, String(coins));
}

function renderCoins() {
  const el = document.querySelector('.coins');
  if (el) el.innerHTML =
    `<a href="coins.html"><img style="width:2.5rem;aspect-ratio:1;" src="assets/coin.png" alt="Coin"></a> <span>${coins}</span>`;
}

function addCoin() {
  coins++;
  saveCoins();
  renderCoins();
}

function substractCoin() {
  if(coins>0){
  coins--;
  saveCoins();
  renderCoins();
  }

}

function currentDate() {
  return new Date(); 
}

function todayDay(d = currentDate()) {
  console.log(d.getDate());
  return Math.min(d.getDate(), 24);
}

function getOpenedDays() {
  return [...opened].map(Number).filter(Number.isFinite).sort((a,b)=>a-b);
}

function updateDaysStyle(){ /* später echte Logik; jetzt leer damit nix crasht */ }
function scrollToToday(){ houseIndex = todayDay(); updateCarousel(); }

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

/* ===== Häuser-Carousel (Focus-Center mit Teasern) ===== */

const HOUSE_COUNT = 24;
const houseSrc = (i) =>
  `assets/houses/${String(i)}.png`;

let houseIndex = 1; // Start bei Haus 1

// DOM Refs
const imgL    = document.querySelector('.house.left');
const imgM    = document.querySelector('.house.main');
const imgR    = document.querySelector('.house.right');
const btnPrev = document.querySelector('.nav-prev');
const btnNext = document.querySelector('.nav-next');
const linkM   = document.querySelector('.house-link');

function applyImg(el, idx) {
  if (!el) return;

  if (idx < 1 || idx > HOUSE_COUNT) {
    el.removeAttribute('src');
    el.setAttribute('alt', '');
    el.classList.add('is-hidden');
  } else {
    el.src = houseSrc(idx);
    el.alt = `Haus ${idx}`;
    el.classList.remove('is-hidden');
  }
}

function updateCarousel() {
  // Nachbarn setzen
  applyImg(imgL, houseIndex - 1);
  applyImg(imgM, houseIndex);
  applyImg(imgR, houseIndex + 1);

  // Link für aktives Haus setzen
  if (linkM) {
    linkM.href = `tage/${String(houseIndex).padStart(2, '0')}.html`;
  }

  // Pfeile sperren falls kein prev/next
  if (btnPrev) {
    btnPrev.toggleAttribute('disabled', houseIndex === 1);
  }
  if (btnNext) {
    btnNext.toggleAttribute('disabled', houseIndex === HOUSE_COUNT);
  }

  // locked/unlocked styling aktualisieren etc.
  updateDaysStyle();
}

/* Button-Klick Logik */
function go(dir) {
  if (dir === -1 && houseIndex > 1) {
    houseIndex -= 1;
    updateCarousel();
  }
  if (dir === 1 && houseIndex < HOUSE_COUNT) {
    houseIndex += 1;
    updateCarousel();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  btnPrev?.addEventListener('click', () => go(-1));
  btnNext?.addEventListener('click', () => go(1));

  // Lock-Check beim Klicken aufs mittlere Haus
  document.querySelectorAll('.level').forEach((level) => {
    level.addEventListener('click', (e) => {
      const isUnlocked = level.classList.contains('unlocked') ||
                         level.classList.contains('opened');
      if (!isUnlocked) {
        e.preventDefault();
        document.getElementById('lockedPopup')?.showModal();
      }
    });
  });

  document.querySelector('.footer-today')
    ?.addEventListener('click', scrollToToday);

  document.querySelector('.coin-button')
    ?.addEventListener('click', addCoin);

  document.querySelector('.less-coin-button')
    ?.addEventListener('click', substractCoin);

  renderCoins();

  requestAnimationFrame(() => {
    // Start auf heutigem Tag wäre nice, aber wir lassen erstmal houseIndex so wie gesetzt
    updateCarousel();
  });
});

window.addEventListener('load', () => setTimeout(updateDaysStyle, 0));