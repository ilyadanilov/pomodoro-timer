const { startBtn, resetBtn } = require("./selectors");
const { startOrPauseCountdown, handleResetBtnClick } = require("./countdown");

startBtn.addEventListener("click", startOrPauseCountdown);
resetBtn.addEventListener("click", handleResetBtnClick);

window.addEventListener('beforeunload', () => {
  removeTimerState();
});
