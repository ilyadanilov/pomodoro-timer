import { defaultPomoLength, pomosTillLongBreak, shortBreak, longBreak } from "./constants";
import { dailyResetOfPomoCounter, getDailyPomoCounter, getTotalPomoCounter, getStoredTimerState, setPomoDailyCounter, setTotalPomoCounter, saveTimerState, removeTimerState } from "./stateStorage";
import { dailyPomoCounterDisplay, totalPomoCounterDisplay, startBtn, timer, notificationSound } from "./selectors";
// Запрос на экранные уведомления
if ("Notification" in window) {
  // Request permission to show notifications
  Notification.requestPermission();
}

let countdownInterval = null;
let blinkInterval = null;
let remainingTime = defaultPomoLength * 60;
let isStarted = false;
let isBreak = false;
dailyResetOfPomoCounter();
updatePomoCountersDisplay();

const storedTimerState = getStoredTimerState();
// Retrieve timer state from sessionStorage if available
if (storedTimerState !== null) {
  const { remainingTime: storedRemainingTime, isStarted: storedIsStarted, isBreak: storedIsBreak } = storedTimerState;
  remainingTime = storedRemainingTime;
  isStarted = storedIsStarted;
  isBreak = storedIsBreak;
  if (storedIsStarted) {
    startCountdown();
  } else {
    updateTimerDisplay();
    if (storedRemainingTime !== remainingTime) {
      startTimerBlinkOnPause();
    }
  }
}

function countdown() {
  if (remainingTime > 0) {
    remainingTime--;
    updateTimerDisplay();
  } else {
    notificationSound.play();

    pauseCountdown();
    startBtn.innerHTML = "Start";
    isStarted = false;
    isBreak = !isBreak;
    if (isBreak) {
      const pomoCounter = getDailyPomoCounter();
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
  saveTimerState();
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
// FUNCTION startCountdown
// -----------------------------------------------------
function startCountdown() {
  countdownInterval = setInterval(countdown, 1);
}
// Object eventHandler
function startTimerBlinkOnPause() {
  blinkInterval = setInterval(timerBlink, 500);
}
function startOrPauseCountdown() {
  if (isStarted) {
    pauseCountdown();
    startTimerBlinkOnPause();
    isStarted = false;
    startBtn.innerHTML = "Resume";
  } else if (!isStarted) {
    startCountdown();
    clearBlickInterval();
    isStarted = true;
    startBtn.innerHTML = "Pause";
  }
  saveTimerState();
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

export {startOrPauseCountdown, resetCountdown, remainingTime, isBreak, isStarted};
