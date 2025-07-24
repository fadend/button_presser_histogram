let lastPressTimeMillis = -1;

const pressCountDisplay = document.getElementById("button-press-count");
const timerDisplay = document.getElementById("milliseconds-timer");
const extraStatsDiv = document.getElementById("extra-stats");
const lastTimeDisplay = document.getElementById("last-time");
const meanTimeDisplay = document.getElementById("mean-time");
const pressTimes = [];
// If this overflows, that's impressive.
let timeSum = 0;
document.getElementById("button").addEventListener("click", function () {
  const now = +new Date();
  if (lastPressTimeMillis > 0) {
    const elapsed = now - lastPressTimeMillis;
    timeSum += elapsed;
    lastTimeDisplay.textContent = elapsed;
    pressTimes.push(elapsed);
  }
  lastPressTimeMillis = now;
  const numPresses = 1 + pressTimes.length;
  pressCountDisplay.textContent = numPresses;
  meanTimeDisplay.textContent = (timeSum / numPresses).toFixed(1);
  if (pressTimes.length) {
    extraStatsDiv.style.display = "";
  }
  Plotly.newPlot("button-press-histogram", [
    { x: pressTimes, type: "histogram" },
  ]);
});
setInterval(() => {
  timerDisplay.textContent = +new Date() - lastPressTimeMillis;
}, 50);
