const fs = require("fs");
document.body.innerHTML = fs.readFileSync("./index.html");
require('../src/selectors');
const countdownModule = require('../src/countdown');

test('remaining time updates', () => {
  const rmt = countdownModule.getRemainingTime();
  console.log(`remaining time before: ${rmt}`);
  countdownModule.updateRemainingTime();
  console.log(`remaining time after: ${countdownModule.getRemainingTime()}`);
  console.log(countdownModule.getRemainingTime());
  expect(countdownModule.getRemainingTime()).toBe(rmt - 1);
});
