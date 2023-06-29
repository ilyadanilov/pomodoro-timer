// IMPORTS

import { defaultPomoLength, pomosTillLongBreak, shortBreak, longBreak } from "./constants";
import { dailyResetOfPomoCounter, getDailyPomoCounter, getTotalPomoCounter, getStoredTimerState, setPomoDailyCounter, incrementTotalPomoCounter, saveTimerState, removeTimerState } from "./stateStorage";
import { dailyPomoCounterDisplay, totalPomoCounterDisplay, startBtn, timer, notificationSound } from "./selectors";

// ЗАПРОС НА ЭКРАННЫЕ УВЕДОМЛЕНИЯ

if ("Notification" in window) {
  // Request permission to show notifications
  Notification.requestPermission();
}

// ПЕРЕМЕННЫЕ

let countdownInterval = null;
let blinkInterval = null;
let remainingTime = defaultPomoLength * 60;
let isStarted = false;
let isBreak = false;

// ПРОВЕРКА И ОБНУЛЕНИЕ ПОМИДОРОВ НА СЕГОДНЯ
dailyResetOfPomoCounter();
updatePomoCountersDisplay();

// ПРОВЕРКА, ЕСТЬ ЛИ СОХРАНЁННОЕ СОСТОЯНИЕ ТАЙМЕРА ПОСЛЕ ПЕРЕЗАГРУЗКИ СТРАНИЦЫ

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
    updateRemainingTime();
    updateTimerDisplay();
  } else {
    handleTimerEnd();
  }
  saveTimerState();
}
// Functions after Refactoring code
function updateRemainingTime() {
  remainingTime--;
}
function playNotificationSound() {
  notificationSound.play();
}
function handleTimerEnd() {
  pauseCountdown();
  playNotificationSound();
  showNotification();
  resetTimer();
  updateTimerDisplay();
  updatePomoCounters();
  dailyResetOfPomoCounter();
}
function updatePomoCounters() {
  incrementPomoCounter();
  incrementTotalPomoCounter();
  updatePomoCountersDisplay();
}
function incrementPomoCounter() {
  const pomoCounter = getDailyPomoCounter();
  setPomoDailyCounter(Number(pomoCounter) + 1);
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
function resetTimer(pomodoro = false) {
  startBtn.innerHTML = "Start";
  isStarted = false;
  if (pomodoro) {
    remainingTime = defaultPomoLength * 60;
    isBreak = false;
  } else {
    isBreak = !isBreak;
    if(getDailyPomoCounter() % pomosTillLongBreak === 0) {
      remainingTime = longBreak * 60;
    } else {
      remainingTime = shortBreak * 60;
    }
  }
  sessionStorage.removeItem('timerState');
  updateTimerDisplay();
};
function handleResetBtnClick() {
  pauseCountdown();
  clearBlickInterval();
  resetTimer(true);
}

function showNotification() {
  if (Notification.permission === "granted") {
    const options = {
      body: "Timer has ended!",
      icon: "path/to/notification-icon.png", // Replace with your notification icon
    };

    const notification = new Notification("Pomodoro Timer", options);

}
}

export {updateRemainingTime, startOrPauseCountdown, handleResetBtnClick, remainingTime, isBreak, isStarted};
