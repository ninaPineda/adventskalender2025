let audio = null;

function normalize(s) {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ") // mehrfach-spaces killen
    .replace(/[.!?,]/g, ""); // bisschen tolerant
}

function playSound(track, cost, day) {
  if (coins < cost) {
    openNoCoinsDialog();
    return;
  }

  //nächsten Freischalten
  if (track == "schlagzeug") {
    document.getElementById("bass").disabled = false;
  } else if (track == "bass") {
    document.getElementById("glocken").disabled = false;
  } else if (track == "glocken") {
    document.getElementById("synth").disabled = false;
  } else if (track == "synth") {
    document.getElementById("melodie").disabled = false;
  }

  // Münzen abziehen
  substractCoin(cost);

  const files = {
    schlagzeug: "../assets/day2/Last Christmas Schlagzeug.MP3",
    bass: "../assets/day2/Last Christmas Bass.MP3",
    glocken: "../assets/day2/Last Christmas Glocken.MP3",
    synth: "../assets/day2/Last Christmas Synthesizer.MP3",
    melodie: "../assets/day2/Last Christmas Melodie.MP3",
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
  return (
    {
      schlagzeug: "Schlagzeug",
      bass: "Bass",
      glocken: "Glocken",
      synth: "Synthesizer",
      melodie: "Melodie",
    }[track] || track
  );
}

function checkAnswer(day) {
  const userAnswer = document
    .getElementById("answerInput")
    .value.toLowerCase()
    .trim();
  let correctAnswers = [];

  if (day == 2) {
    correctAnswers = [
      "last christmas",
      "lastchristmas",
      "last christmas wham",
      "last christmas von wham",
    ];
  } else if (day == 31) {
    correctAnswers = [
      "martin luther",
      "luther",
      "martin",
      "martin luter",
      "martin luthe",
      "martin lutter",
      "martinn luther",
      "marin luther",
      "martin luter",
      "maatin luther",
      "m luther",
      "m.luther",
      "martin-luther",
    ];
  } else if (day == 32) {
    correctAnswers = [
      "pippi langstrumpf",
      "pipi langstrumpf",
      "pippi",
      "langstrumpf",
      "pippi langstrump",
      "pipi langstrump",
      "pippy langstrumpf",
      "pipi langstrupf",
      "pippi langstrupf",
      "pipi langstrump",
      "pippi langstrimpf",
      "pipi langstrimpf",
      "pippi lang",
      "p langstrumpf",
      "langstrumpf pippi",
      "pippi-langtstrumpf",
    ];
  } else if (day == 33) {
    correctAnswers = [
      "loriot",
      "vio lorenz",
      "bernhard victor",
      "vicco von bülow",
      "vicco von bulow",
      "vicco",
      "von bülow",
      "von bulow",
      "loriott",
      "loriot.",
      "loriot!",
      "lorio",
      "lori o t",
    ];
  } else if (day == 34) {
    correctAnswers = [
      "mariah carey",
      "mariah",
      "carey",
      "maraya carey",
      "maria carey",
      "mariah cary",
      "mariah carry",
      "mareah carey",
      "mariah-cdgarey", // falls jemand tippselt
      "m carey",
      "m. carey",
      "queen of christmas",
    ];
  } else if (day == 3) {
    correctAnswers = [
      "die ärzte",
      "die arzte",
      "ärzte",
      "arzte",
      "ärtzte",
      "die ärtze",
      "die äreste",
      "diearzt",
      "die aerzte",
      "die-aerzte",
      "die ärzTe",
      "die aerzte",
      "arztE",
      "die ärzte!",
      "die ärzte.",
    ];
  } else if (day == 4) {
    correctAnswers = ["3", 3, "drei", "03"];
  } else if (day == 51) {
    correctAnswers = [
      "dänemark",
      "Dänemark",
      "daenemark",
      "Daenemark",
      "denmark",
      "Denmark",
      "danmark",
      "Danmark",
    ];
  } else if (day == 52) {
    correctAnswers = [
      "zypern",
      "Zypern",
      "cypern",
      "Cypern",
      "cyprus",
      "Cyprus",
      "kipros", // griechisch eingedeutscht
      "Kipros",
    ];
  } else if (day == 53) {
    correctAnswers = [
      "vietnam",
      "Vietnam",
      "viet nam", // manche schreiben getrennt
      "Viet Nam",
    ];
  } else if (day == 54) {
    correctAnswers = [
      "chile",
      "Chile",
      "tschile", // sehr selten, aber manche schreiben’s so
      "Tschile",
    ];
  } else if (day == 5) {
    correctAnswers = [
      "monaco",
      "Monaco",
      "monaco-ville", // wird manchmal so eingetippt
      "Monaco-Ville",
    ];
  } else if (day == 8) {
    correctAnswers = [
      "55",
      55,
      "fünfundfünfzig"
    ];
  }

  if (correctAnswers.includes(userAnswer)) {
    // Zwischensteps (31, 32, 33, 34)
    if ([31, 32, 33, 34].includes(day)) {
      // Nächsten Step berechnen
      const nextStep = day + 1;

      // Konfetti-Effekt
      confetti({
        particleCount: 1000,
        spread: 110,
        startVelocity: 50,
        scalar: 1.5,
        gravity: 0.6,
        origin: { y: 1.3 },
        colors: [
          "#962a2a",
          "#E24A39",
          "#065308",
          "#2E8B33",
          "#FFD530",
          "#F8F4EF",
        ],
        zIndex: 9999,
      });

      setTimeout(() => {
        window.location.href = `template.html?tag=${nextStep}`;
      }, 600);
    } else if ([51, 52, 53, 54].includes(day)) {
      // Nächsten Step berechnen
      const nextStep = day + 1;

      // Konfetti-Effekt
      confetti({
        particleCount: 1000,
        spread: 110,
        startVelocity: 50,
        scalar: 1.5,
        gravity: 0.6,
        origin: { y: 1.3 },
        colors: [
          "#962a2a",
          "#E24A39",
          "#065308",
          "#2E8B33",
          "#FFD530",
          "#F8F4EF",
        ],
        zIndex: 9999,
      });

      setTimeout(() => {
        window.location.href = `template.html?tag=${nextStep}`;
      }, 600);
    } else {
      // Finale Lösung
      rightSolution(day);
    }
  } else {
    wrongSolution();
  }
}
