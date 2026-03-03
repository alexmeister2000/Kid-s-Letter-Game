const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const scoreEl = document.getElementById("score");
const roundEl = document.getElementById("round");
const promptText = document.getElementById("promptText");
const feedbackEl = document.getElementById("feedback");
const speakBtn = document.getElementById("speakBtn");
const nextBtn = document.getElementById("nextBtn");
const letterGrid = document.getElementById("letterGrid");

let options = [];
let targetLetter = "";
let score = 0;
let round = 1;
let hasAnswered = false;

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
  const utterance = new SpeechSynthesisUtterance(letter);
  utterance.rate = 0.85;
  utterance.pitch = 1.1;
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
  if (hasAnswered) {
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
}

function startRound() {
  options = pickFourLetters();
  targetLetter = chooseTarget();
  hasAnswered = false;
  promptText.textContent = `Can you find letter ${targetLetter}?`;
  feedbackEl.textContent = "";
  roundEl.textContent = String(round);

  renderOptions();
  enableCards();
  speakLetter(targetLetter);
}

speakBtn.addEventListener("click", () => speakLetter(targetLetter));
nextBtn.addEventListener("click", () => {
  round += 1;
  startRound();
});

startRound();
