const LS_KEY = "advent_opened";
const LS_KEY_COINS = "advent_coins";
const images = document.querySelector(".houses");
const total = document.querySelectorAll(".houses img").length;
const leftArrow = document.querySelector(".arrow.left");
const rightArrow = document.querySelector(".arrow.right");
const opened = new Set(JSON.parse(localStorage.getItem(LS_KEY) || "[]"));
let coins = new Number(localStorage.getItem(LS_KEY_COINS) ?? "9");
let currentIndex = 1;
const LS_KEY_USER = "advent_user_name";

function getOrAskUserName() {
  let name = localStorage.getItem(LS_KEY_USER);

  if (!name) {
    name = prompt("Wie heißt du? (Nickname reicht 🙂)")?.trim();

    // falls abgebrochen oder leer: nochmal kurz nerven oder fallback
    if (!name) name = "Unbekannt";

    localStorage.setItem(LS_KEY_USER, name);
  }

  return name;
}

function saveOpened() {
  localStorage.setItem(LS_KEY, JSON.stringify([...opened]));
}
function saveCoins() {
  localStorage.setItem(LS_KEY_COINS, String(coins));
}

function renderCoins() {
  const el = document.querySelector(".coins");
  if (!el) return;

  // prüfen, ob wir im Unterordner "tage" sind
  const inTage = window.location.pathname.includes("/tage/");
  const prefix = inTage ? "../" : "";

  el.innerHTML = `
    <a href="${prefix}coins.html">
      <img style="width:2.5rem;aspect-ratio:1;" src="${prefix}assets/coin.png" alt="Coin">
    </a>
    <span>${coins}</span>
  `;
}

function addCoin() {
  coins++;
  saveCoins();
  renderCoins();
}

function substractCoin(amount = 1) {
  if (coins < amount) {
    return false; // nicht genug Coins → nix passiert
  }

  coins -= amount;
  saveCoins();
  renderCoins();
  return true; // erfolgreich abgezogen
}

function currentDate() {
  return new Date();
}

function todayDay(d = currentDate()) {
  return Math.min(d.getDate(), 24);
}

function getOpenedDays() {
  return [...opened]
    .map(Number)
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
}

function openExplanaition() {
    const dlg = document.getElementById("hintDialog");
    dlg?.showModal();
}

function showCheckDialog() {
    const dlg = document.getElementById("checkDialog");
    dlg?.showModal();
}

function openHint() {
  closeCheckDialog();
  if (coins >= 10) {
    substractCoin(10);
    const dlg = document.getElementById("hintDialog");
    dlg?.showModal();
  } else {
    const dlg = document.getElementById("noCoinsDialog");
    dlg?.showModal();
  }
}

function closeNoCoinsDialog() {
  const dlg = document.getElementById("noCoinsDialog");
  dlg?.close();
}

function closeHint() {
  const dlg = document.getElementById("hintDialog");
  dlg?.close();
}

function closeNoAnswerDialog() {
  const dlg = document.getElementById("noAnswerDialog");
  dlg?.close();
}

function closeCheckDialog() {
  const dlg = document.getElementById("checkDialog");
  dlg?.close();
}

function wrongSolution() {
  if (coins > 0) {
    substractCoin();
    const el = document.querySelector(".day-content");
    el.classList.add("glitch");
    setTimeout(() => el.classList.remove("glitch"), 200);
  } else {
    const dlg = document.getElementById("noAnswerDialog");
    dlg?.showModal();
  }
}

function rightSolution(day) {
  if (coins > 0) {
    addCoin();
    if (!opened.has(day)) {
      opened.add(day);
      saveOpened();
      logSolvedDay(day);
    }

  // Konfetti-Effekt (rot/grün)
  confetti({
    particleCount: 1000, // MEHR!
    spread: 110, // breiter
    startVelocity: 50, // schneller los
    scalar: 1.5, // GRÖSSER!
    gravity: 0.6, // länger in der Luft
    origin: { y: 1.3 },
    colors: [
      "#962a2a", // dunkelrot
      "#E24A39", // hellrot
      "#065308", // dunkelgrün
      "#2E8B33", // hellgrün
      "#FFD530", // gold
      "#F8F4EF", // schnee
    ],
    zIndex: 9999,
  });

  setTimeout(() => {
    window.location.href = "../index.html";
  }, 1000);
   } else {
    const dlg = document.getElementById("noAnswerDialog");
    dlg?.showModal();
  }
}

function scrollToToday() {
  currentIndex = todayDay();
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

function lockFutureDays() {
  const links = document.querySelectorAll(".houses a");
  const today = todayDay();
  const openedDays = getOpenedDays();

  links.forEach((link) => {
    // NEU: Tag aus beiden URL-Varianten ziehen
    let day = null;

    // 1) neue Variante: template.html?tag=12
    const qMatch = link.href.match(/[?&]tag=(\d+)/);
    if (qMatch) day = parseInt(qMatch[1], 10);

    // 2) alte Variante: tage/12.html
    if (day === null) {
      const pathMatch = link.href.match(/tage\/(\d+)\.html/);
      if (pathMatch) day = parseInt(pathMatch[1], 10);
    }

    if (day === null) return;

    // optional: skip intro/bonus
    if (day === 0 || day === 25) return;

    const prevDayUnlocked = day === 1 || openedDays.includes(day - 1);

    if (day > today || !prevDayUnlocked) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("lockedPopup")?.showModal();
      });
      link.style.filter = "grayscale(0.7) brightness(0.6)";
      link.style.pointerEvents = "auto";
    }
  });
}

function getDayFromUrl() {
  const m = window.location.search.match(/tag=(\d+)/);
  return m ? parseInt(m[1], 10) : 1;
}

async function loadDayContent(day) {
  const slot = document.getElementById("daySlot");
  if (!slot) return;

  try {
    const res = await fetch(`./content/${day}.html`);
    slot.innerHTML = await res.text();
  } catch (e) {
    slot.innerHTML = `<p class="question">Oops – Inhalt für Tag ${day} nicht gefunden.</p>`;
  }
}

const LOG_ENDPOINT = "https://script.google.com/macros/s/AKfycbyCPyvtlEahMjcKvNUHhHBSHDLTd7oJdZNxbw_dJ0a5JoESokI5iODz-Fto8B7joqoQ/exec";

function logSolvedDay(day) {
  let userId = localStorage.getItem("advent_user_id");
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("advent_user_id", userId);
  }

  const userName = getOrAskUserName();

  fetch(LOG_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      day,
      userId,
      userName,   // <- neu
      coins,
      info: "solved",
      notify: true
    })
  }).catch(() => {});
}

document.addEventListener("DOMContentLoaded", () => {
  const day = getDayFromUrl();
  loadDayContent(day);

  document
    .querySelector(".footer-today")
    ?.addEventListener("click", scrollToToday);

  renderCoins();
  updateGallery();
  lockFutureDays();
});
