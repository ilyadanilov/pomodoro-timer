import { startBtn, resetBtn } from "./selectors";
import { startOrPauseCountdown, handleResetBtnClick } from "./countdown";

startBtn.addEventListener("click", startOrPauseCountdown);
resetBtn.addEventListener("click", handleResetBtnClick);

window.addEventListener('beforeunload', () => {
  removeTimerState();
});
