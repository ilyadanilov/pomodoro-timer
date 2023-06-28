import { startBtn, resetBtn } from "./selectors";
import { startOrPauseCountdown, resetCountdown } from "./countdown";

startBtn.addEventListener("click", startOrPauseCountdown);
resetBtn.addEventListener("click", resetCountdown);

window.addEventListener('beforeunload', () => {
  removeTimerState();
});
