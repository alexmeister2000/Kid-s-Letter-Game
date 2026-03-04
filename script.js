const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const scoreEl = document.getElementById("score");
const roundEl = document.getElementById("round");
const promptText = document.getElementById("promptText");
const audioStatusEl = document.getElementById("audioStatus");
const feedbackEl = document.getElementById("feedback");
const startBtn = document.getElementById("startBtn");
const speakBtn = document.getElementById("speakBtn");
const nextBtn = document.getElementById("nextBtn");
const letterGrid = document.getElementById("letterGrid");

let options = [];
let targetLetter = "";
let score = 0;
let round = 1;
let hasAnswered = false;
let isGameStarted = false;

const encouragements = [
  "Great job! 🌟",
  "Awesome listening! 🎉",
  "You got it! 🙌",
  "Fantastic work! 🥳",
];

function pickFourLetters() {
  const shuffled = [...letters].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4);
}

function chooseTarget() {
  return options[Math.floor(Math.random() * options.length)];
}

function speakLetter(letter) {
  if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === "undefined") {
    audioStatusEl.textContent = "Audio is not supported in this browser. Please try Chrome, Edge, or Safari.";
    return;
  }

  const utterance = new SpeechSynthesisUtterance(letter);
  utterance.rate = 0.75;
  utterance.pitch = 1.2;
  utterance.volume = 1;

  utterance.onstart = () => {
    audioStatusEl.textContent = `🔊 Listening prompt: Letter ${letter}`;
  };

  utterance.onend = () => {
    audioStatusEl.textContent = "Tap a letter card!";
  };

  utterance.onerror = () => {
    audioStatusEl.textContent = "Audio prompt failed. Tap “Say Letter” to try again.";
  };

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function renderOptions() {
  letterGrid.innerHTML = "";

  options.forEach((letter) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "letter-card";
    button.dataset.letter = letter;
    button.innerHTML = `<span aria-hidden="true">${letter} ${letter.toLowerCase()}</span><span class="sr-only">Letter ${letter}</span>`;
    button.addEventListener("click", () => handleChoice(button, letter));
    letterGrid.appendChild(button);
  });
}

function disableCards() {
  Array.from(letterGrid.children).forEach((button) => {
    button.disabled = true;
  });
}

function enableCards() {
  Array.from(letterGrid.children).forEach((button) => {
    button.disabled = false;
    button.classList.remove("correct", "wrong");
  });
}

function handleChoice(button, letter) {
  if (hasAnswered || !isGameStarted) {
    return;
  }

  hasAnswered = true;
  disableCards();

  if (letter === targetLetter) {
    score += 1;
    scoreEl.textContent = String(score);
    button.classList.add("correct");
    feedbackEl.textContent = encouragements[Math.floor(Math.random() * encouragements.length)];
  } else {
    button.classList.add("wrong");
    const correctButton = letterGrid.querySelector(`[data-letter="${targetLetter}"]`);
    if (correctButton) {
      correctButton.classList.add("correct");
    }
    feedbackEl.textContent = `Nice try! The correct letter was ${targetLetter}.`;
  }

  nextBtn.disabled = false;
}

function startRound() {
  options = pickFourLetters();
  targetLetter = chooseTarget();
  hasAnswered = false;
  promptText.textContent = `Find letter ${targetLetter}`;
  feedbackEl.textContent = "";
  roundEl.textContent = String(round);
  nextBtn.disabled = true;

  renderOptions();
  enableCards();
  speakLetter(targetLetter);
}

startBtn.addEventListener("click", () => {
  isGameStarted = true;
  startBtn.disabled = true;
  speakBtn.disabled = false;
  startRound();
});

speakBtn.addEventListener("click", () => {
  if (isGameStarted) {
    speakLetter(targetLetter);
  }
});

nextBtn.addEventListener("click", () => {
  if (!isGameStarted) {
    return;
  }

  round += 1;
  startRound();
});
