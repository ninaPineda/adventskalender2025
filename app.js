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

/* ===== Häuser-Carousel ===== */

/** Anzahl & Pfadschema deiner Haus-Bilder */
const HOUSE_COUNT = 24;
const houseSrc = (i) => `assets/houses/haus-${String(i).padStart(2, '0')}.png`;

/** State */
let houseIndex = 1; // Start bei Haus 1

/** DOM refs */
const beltEl  = document.querySelector('.belt');
const imgL    = document.querySelector('.house.left');
const imgM    = document.querySelector('.house.main');
const imgR    = document.querySelector('.house.right');
const btnPrev = document.querySelector('.nav-prev');
const btnNext = document.querySelector('.nav-next');
const linkM  = document.querySelector('.house-link');

/** Hilfen */
function setImg(el, idx){
  if (idx < 1 || idx > HOUSE_COUNT) {
    el.removeAttribute('src'); el.setAttribute('alt','');
    el.style.visibility = 'hidden';
  } else {
    el.src = houseSrc(idx);
    el.alt = `Haus ${idx}`;
    el.style.visibility = 'visible';
  }
}

function updateCarousel(){
  // Nachbarn setzen
  setImg(imgL, houseIndex - 1);
  setImg(imgM, houseIndex);
  setImg(imgR, houseIndex + 1);

  // Link anpassen
linkM.href = `/tage/${String(houseIndex).padStart(2, '0')}.html`;

  // Pfeile ein-/ausblenden
  btnPrev.toggleAttribute('disabled', houseIndex === 1);
  btnNext.toggleAttribute('disabled', houseIndex === HOUSE_COUNT);

  // Belt wieder auf Mitte
  beltEl.classList.remove('anim-left','anim-right');
  // Force reflow, falls direkt erneut geklickt wurde
  // eslint-disable-next-line no-unused-expressions
  beltEl.offsetHeight;
}

function go(dir){
  // Bounds check
  if ((dir === 1 && houseIndex >= HOUSE_COUNT) || (dir === -1 && houseIndex <= 1)) return;

  // Animation starten
  beltEl.classList.add(dir === 1 ? 'anim-right' : 'anim-left');

  // Nach Ende der Transition Index verschieben, Bilder neu setzen, Belt resetten
  const onDone = () => {
    beltEl.removeEventListener('transitionend', onDone, { once: true });
    houseIndex += dir;
    updateCarousel();
  };
  beltEl.addEventListener('transitionend', onDone, { once: true });
}

/** Events */
btnPrev?.addEventListener('click', () => go(-1));
btnNext?.addEventListener('click', () => go(1));

/** Init nach deinem bisherigen DOMContentLoaded-Setup */
document.addEventListener('DOMContentLoaded', () => {
  updateCarousel();
});

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
    document.querySelector('.coin-button')?.addEventListener('click', addCoin);
        document.querySelector('.less-coin-button')?.addEventListener('click', substractCoin);
  renderCoins();

  requestAnimationFrame(() => {
    updateDaysStyle();
    scrollToActive();
  });
});

window.addEventListener('load', () => setTimeout(updateDaysStyle, 0));