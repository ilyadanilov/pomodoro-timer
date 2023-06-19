var startBtn = document.querySelector(".pomodoro__start-btn");
var timer = document.querySelector(".pomodoro__timer");
var resetBtn = document.querySelector(".pomodoro__reset-btn");
var defaultMinutes = 25;
let breakMinutes = 5;
var countdownInterval = null;
var blinkInterval = null;
var remainingTime = defaultMinutes * 60;
let isStarted = false;
let isBreak = false;
// FUNCTION countdown
// -----------------------------------------------------
function countdown() {
  if (remainingTime > 0) {
    remainingTime--;
    updateDisplay();
  } else {
    pauseCountdown();
    startBtn.innerHTML = "Start";
    isStarted = false;
    isBreak = !isBreak;
    remainingTime = isBreak ? breakMinutes * 60 : defaultMinutes * 60;
    updateDisplay();
  }
}
function updateDisplay() {
  let minutes = Math.floor(remainingTime / 60);
  let seconds = remainingTime % 60;
  let displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  let displaySeconds = seconds < 10 ? `0${seconds}` : seconds;
  timer.innerHTML = `${displayMinutes}:${displaySeconds}`;
}
// FUNCTION timerBlink
// -----------------------------------------------------
function timerBlink() {
  timer.style.opacity == 1
    ? (timer.style.opacity = 0)
    : (timer.style.opacity = 1);
}

// FUNCTION startCountdown
// -----------------------------------------------------
function startCountdown() {
  countdownInterval = setInterval(countdown, 1000);
}
// Object eventHandler

function startOrPauseCountdown() {
  if (isStarted) {
    pauseCountdown();
    blinkInterval = setInterval(timerBlink, 500);
    isStarted = false;
    startBtn.innerHTML = "Resume";
  } else if (!isStarted) {
    startCountdown();
    clearBlickInterval();
    isStarted = true;
    startBtn.innerHTML = "Pause";
  }
}
function clearBlickInterval() {
  timer.style.opacity = 1;
  if (blinkInterval) {
    clearInterval(blinkInterval);
  }
}

function pauseCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  console.log(countdownInterval);
}

function resetCountdown() {
  pauseCountdown();
  clearBlickInterval();
  startBtn.innerHTML = "Start";
  remainingTime = defaultMinutes * 60;
  isStarted = false;
  isBreak = false;
  updateDisplay();
}

// Event listener for startBtn
// -----------------------------------------------------
startBtn.addEventListener("click", startOrPauseCountdown);
// Event listener for resetRtn
// -----------------------------------------------------
resetBtn.addEventListener("click", resetCountdown);
