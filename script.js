// Пользовательские значения
const userDefinedPomodoroLength = null;
const userDefinedShortBreak = null;
const userDefinedLongBreak = null;
const userDefinedPomodorosTillLongBreak = null;
// Дефолтные значения и селекторы
const startBtn = document.querySelector(".pomodoro__start-btn");
const timer = document.querySelector(".pomodoro__timer");
const resetBtn = document.querySelector(".pomodoro__reset-btn");
const defaultPomodoroLength = userDefinedPomodoroLength || 25;
const shortBreak = userDefinedShortBreak || 5;
const longBreak = userDefinedLongBreak || 15;
const pomodorosTillLongBreak = userDefinedPomodorosTillLongBreak || 4;
let countdownInterval = null;
let blinkInterval = null;
let remainingTime = defaultPomodoroLength * 60;
let isStarted = false;
let isBreak = false;
let pomodoroCounter = 0;
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
    if (isBreak) {
      pomodoroCounter += 1;
      if(pomodoroCounter % pomodorosTillLongBreak === 0) {
        remainingTime = longBreak * 60;
      } else {
        remainingTime = shortBreak * 60;
      }
    } else {
      remainingTime = defaultPomodoroLength * 60;

    }
    // remainingTime = isBreak ? shortBreak * 60 : defaultPomodoroLength * 60;
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
  countdownInterval = setInterval(countdown, 1);
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
}

function resetCountdown() {
  pauseCountdown();
  clearBlickInterval();
  startBtn.innerHTML = "Start";
  remainingTime = defaultPomodoroLength * 60;
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
