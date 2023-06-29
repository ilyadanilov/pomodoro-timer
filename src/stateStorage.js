const {remainingTime, isBreak, isStarted} = require('./countdown');

function setPomoDailyCounter(pomosToday) {
  const date = new Date();
  const uniqueDate = new Date().toLocaleDateString();

  const counter = {
    pomosToday,
    uniqueDate
  }
  localStorage.setItem('pomoDailyCounter', JSON.stringify(counter));
}

function incrementTotalPomoCounter() {
  const currTotal = Number(localStorage.getItem('totalPomoCounter'));
  localStorage.setItem('totalPomoCounter', `${currTotal + 1}`);
}

function getTotalPomoCounter() {
  const tpm = localStorage.getItem('totalPomoCounter');
  if(tpm !== null) {
    return tpm
  } else {
    return 0;
  }
}

function getDailyPomoCounter() {
  const counter = JSON.parse(localStorage.getItem('pomoDailyCounter'));
  if (counter != null) {
    return counter.pomosToday;
  } else {
    return 0;
  }
}

function dailyResetOfPomoCounter() {
  const counter = JSON.parse(localStorage.getItem('pomoDailyCounter'));
  if (counter != null) {
    const storedDate = counter.uniqueDate;
    const currentDate = new Date().toLocaleDateString();
    if (storedDate !== currentDate) {
      setPomoDailyCounter(0);
    }
  }
}
function getStoredTimerState() {
  const storedState = sessionStorage.getItem('timerState');
  return storedState ? JSON.parse(storedState) : null;
}
function saveTimerState() {
  const timerState = {
    remainingTime,
    isStarted,
    isBreak
  };
  sessionStorage.setItem('timerState', JSON.stringify(timerState));
}

function removeTimerState() {
  sessionStorage.removeItem('timerState');
}
module.exports = {dailyResetOfPomoCounter, getDailyPomoCounter, getTotalPomoCounter, getStoredTimerState, setPomoDailyCounter, incrementTotalPomoCounter, saveTimerState, removeTimerState}
