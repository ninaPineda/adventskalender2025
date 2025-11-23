
  let audio = null;


  function normalize(s){
    return s.toLowerCase().trim()
      .replace(/\s+/g, " ")          // mehrfach-spaces killen
      .replace(/[.!?,]/g, "");      // bisschen tolerant
  }

  function playSound(track, cost, day) {
    // Wenn nicht genug Geld da ist → Stop
    if (coins < cost) {
      openNoCoinsDialog();
      return;
    }

    // Münzen abziehen
    substractCoin(cost);

    const files = {
      schlagzeug: "../assets/day2/Last Christmas Schlagzeug.mp3",
      bass: "../assets/day2/Last Christmas Bass.mp3",
      glocken: "../assets/day2/Last Christmas Glocken.mp3",
      synth: "../assets/day2/Last Christmas Synthesizer.mp3",
      melodie: "../assets/day2/Last Christmas Melodie.mp3",
    };

    // alte Audio stoppen, wenn was läuft
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    audio = new Audio(files[track]);
    wirePlayer(audio, track);
    audio.play().catch((err) => console.log("Audio Error:", err));
  }

  function wirePlayer(a, track) {
    const player = document.getElementById("miniPlayer");
    const title = document.getElementById("nowPlaying");
    const bar = document.getElementById("playerProgress");
    const toggleBtn = document.querySelector(".mini-player__toggle");

    title.textContent = "🎵 " + trackLabel(track);
    player.hidden = false;
    toggleBtn.textContent = "⏸";

    a.addEventListener("timeupdate", () => {
      const p = (a.currentTime / a.duration) * 100 || 0;
      bar.style.width = p + "%";
    });

    a.addEventListener("ended", () => {
      bar.style.width = "0%";
      toggleBtn.textContent = "▶";
    });
  }

  function togglePlay() {
    if (!audio) return;
    const btn = document.querySelector(".mini-player__toggle");
    if (audio.paused) {
      audio.play();
      btn.textContent = "⏸";
    } else {
      audio.pause();
      btn.textContent = "▶";
    }
  }

  function trackLabel(track) {
    return {
      schlagzeug: "Schlagzeug",
      bass: "Bass",
      glocken: "Glocken",
      synth: "Synthesizer",
      melodie: "Melodie"
    }[track] || track;
  }

  function checkAnswer(day) {
const userAnswer = document
  .getElementById("answerInput")
  .value
  .toLowerCase()
  .trim();
    let correctAnswers = [];

    if (day == 2) {
      correctAnswers = [
        "last christmas",
        "lastchristmas",
        "last christmas wham",
        "last christmas von wham",
      ];
    } else if (day == 31){
      correctAnswers = [
        "1",
      ];
    } else if (day == 32){
      correctAnswers = [
        "2",
      ];
    } else if (day == 33){
      correctAnswers = [
        "3",
      ];
    } else if (day == 34){
      correctAnswers = [
        "4",
      ];
    } else if (day == 35){
      correctAnswers = [
        "5",
      ];
    } 

if (correctAnswers.includes(userAnswer)) {
  if (day == 31 || day == 32 ||day == 33 || day == 34 ){
loadDayContent(day+1);
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
  })
  } else {
    rightSolution(day); 
  }

    } else {
      wrongSolution();
    }
  }