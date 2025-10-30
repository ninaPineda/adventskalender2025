const LS_KEY = 'advent_opened';
const LS_KEY_COINS = 'advent_coins';
const images = document.querySelector('.houses');
const total = document.querySelectorAll('.houses img').length;
const leftArrow = document.querySelector('.arrow.left');
const rightArrow = document.querySelector('.arrow.right');
const opened = new Set(JSON.parse(localStorage.getItem(LS_KEY) || '[]'));
let coins = new Number(localStorage.getItem(LS_KEY_COINS) ?? '9');
let currentIndex = 1;

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
  return Math.min(d.getDate(), 24);
}

function getOpenedDays() {
  return [...opened].map(Number).filter(Number.isFinite).sort((a,b)=>a-b);
}

function rightSolution(day) {
  if (!opened.has(day)) {
    opened.add(day);
    saveOpened();
  }

  // Konfetti-Effekt (rot/grün)
  confetti({
    particleCount: 120,
    spread: 90,
    origin: { y: 1 },
    colors: ['#962a2a', '#065308'] // deine Main-Farben
  });

  setTimeout(() => {
    window.location.href = "../index.html";
  }, 1000);
}

function scrollToToday(){
  //currentIndex = todayDay();
  currentIndex =  5;
  updateGallery();
}

function updateGallery() {
  images.style.transform = `translateX(-${currentIndex * 100}%)`;
  leftArrow.disabled = currentIndex === 1;
  rightArrow.disabled = currentIndex === total - 2;
}

function nextImage() {
  if (currentIndex < total - 2) currentIndex++;
  updateGallery();
}

function prevImage() {
  if (currentIndex > 1) currentIndex--;
  updateGallery();
}

document.addEventListener('DOMContentLoaded', () => {

  document.querySelector('.footer-today')
    ?.addEventListener('click', scrollToToday);

  document.querySelector('.coin-button')
    ?.addEventListener('click', addCoin);

  document.querySelector('.less-coin-button')
    ?.addEventListener('click', substractCoin);

  renderCoins();
  updateGallery();
});