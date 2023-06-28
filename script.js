// Пользовательские значения
const userDefinedPomoLength = null;
const userDefinedShortBreak = null;
const userDefinedLongBreak = null;
const userDefinedPomosTillLongBreak = null;
// Дефолтные значения и селекторы
const startBtn = document.querySelector(".pomodoro__start-btn");
const timer = document.querySelector(".pomodoro__timer");
const resetBtn = document.querySelector(".pomodoro__reset-btn");
const dailyPomoCounterDisplay = document.querySelector(".daily-pomodoro-counter");
const totalPomoCounterDisplay = document.querySelector('.total-pomodoro-counter');
const defaultPomoLength = userDefinedPomoLength || 25;
const shortBreak = userDefinedShortBreak || 5;
const longBreak = userDefinedLongBreak || 15;
const pomosTillLongBreak = userDefinedPomosTillLongBreak || 4;
let countdownInterval = null;
let blinkInterval = null;
let remainingTime = defaultPomoLength * 60;
let isStarted = false;
let isBreak = false;
dailyResetOfPomoCounter();
updatePomoCountersDisplay();
// Retrieve timer state from sessionStorage if available
const storedTimerState = sessionStorage.getItem('timerState');
if (storedTimerState) {
  const { remainingTime: storedRemainingTime, isStarted: storedIsStarted, isBreak: storedIsBreak } = JSON.parse(storedTimerState);
  remainingTime = storedRemainingTime;
  isStarted = storedIsStarted;
  isBreak = storedIsBreak;
  if (isStarted) {
    startCountdown();
  }
}

function setPomoDailyCounter(pomosToday){
const date = new Date();
console.log(date);
const uniqueDate = new Date().toLocaleDateString();

const counter = {
  pomosToday,
  uniqueDate
}
localStorage.setItem('pomoDailyCounter', JSON.stringify(counter));
}
function setTotalPomoCounter() {
  const currTotal = Number(localStorage.getItem('totalPomoCounter'));
  localStorage.setItem('totalPomoCounter', `${currTotal + 1}`);
}
function getTotalPomoCounter() {
  return localStorage.getItem('totalPomoCounter');
}
function getDailyPomoCounter() {
  const counter = JSON.parse(localStorage.getItem('pomoDailyCounter'));
  if(counter != null) {
    return counter.pomosToday;
  } else {
    return 0;
  }
  // Здесь будет геттер, который будет парсить json объект, сравнивать инфу из него и выдавать какой-нибудь counter.value if counter.date === new Date().getDay блаблабла уникальный стамп сегодняшнего дня.
}
function dailyResetOfPomoCounter() {
const counter = JSON.parse(localStorage.getItem('pomoDailyCounter'));
if (counter != null) {
  const storedDate = counter.uniqueDate;
  const currentDate = new Date().toLocaleDateString();
  if (storedDate !== currentDate) {
    // Reset the daily counter for a new day
    setPomoDailyCounter(0);
  }
}
}
// FUNCTION countdown
// -----------------------------------------------------
function countdown() {
  if (remainingTime > 0) {
    remainingTime--;
    updateTimerDisplay();
  } else {
    pauseCountdown();
    startBtn.innerHTML = "Start";
    isStarted = false;
    isBreak = !isBreak;
    if (isBreak) {
      const pomoCounter = getDailyPomoCounter();
      console.log(pomoCounter);
      setPomoDailyCounter(Number(pomoCounter)+1);
      setTotalPomoCounter();
      if(pomoCounter % pomosTillLongBreak === 0) {
        remainingTime = longBreak * 60;
      } else {
        remainingTime = shortBreak * 60;
      }
    } else {
      remainingTime = defaultPomoLength * 60;

    }
    updateTimerDisplay();
    updatePomoCountersDisplay();
    dailyResetOfPomoCounter();
  }
  const timerState = {
    remainingTime,
    isStarted,
    isBreak
  };
  sessionStorage.setItem('timerState', JSON.stringify(timerState));
}
function updateTimerDisplay() {
  let minutes = Math.floor(remainingTime / 60);
  let seconds = remainingTime % 60;
  let displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  let displaySeconds = seconds < 10 ? `0${seconds}` : seconds;
  timer.innerHTML = `${displayMinutes}:${displaySeconds}`;
}
function updatePomoCountersDisplay() {
  dailyPomoCounterDisplay.innerHTML = getDailyPomoCounter();
  totalPomoCounterDisplay.innerHTML = getTotalPomoCounter();
}
// FUNCTION timerBlink
// -----------------------------------------------------
function timerBlink() {
  timer.style.opacity == 1
    ? (timer.style.opacity = 0)
    : (timer.style.opacity = 1);
}
console.log()
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
  remainingTime = defaultPomoLength * 60;
  isStarted = false;
  isBreak = false;
  sessionStorage.removeItem('timerState');
  updateTimerDisplay();
}

// Event listener for startBtn
// -----------------------------------------------------
startBtn.addEventListener("click", startOrPauseCountdown);
// Event listener for resetRtn
// -----------------------------------------------------
resetBtn.addEventListener("click", resetCountdown);
