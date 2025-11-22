
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
    } else if (day == 3){
      correctAnswers = [
        "charles",
      ];
    } 

if (correctAnswers.includes(userAnswer)) {
    rightSolution(day); 
    } else {
      alert("Leider falsch 😭");
    }
  }