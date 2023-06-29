const startBtn = document.querySelector(".pomodoro__start-btn");
const timer = document.querySelector(".pomodoro__timer");
const resetBtn = document.querySelector(".pomodoro__reset-btn");
const dailyPomoCounterDisplay = document.querySelector(".daily-pomodoro-counter");
const totalPomoCounterDisplay = document.querySelector('.total-pomodoro-counter');
const notificationSound = document.getElementById('timer-end-sound');
module.exports = {dailyPomoCounterDisplay, totalPomoCounterDisplay, startBtn, resetBtn, timer, notificationSound};
