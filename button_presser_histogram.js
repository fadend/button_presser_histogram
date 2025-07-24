const pressCountDisplay = document.getElementById("button-press-count");
const timerDisplay = document.getElementById("milliseconds-timer");
const extraStatsDiv = document.getElementById("extra-stats");
const lastTimeDisplay = document.getElementById("last-time");
const meanTimeDisplay = document.getElementById("mean-time");
const durationDisplay = document.getElementById("duration");

let startTime = -1;
let lastPressTime = -1;
const pressTimes = [];
const perSecondCount = [0];
const seconds = [0];

function extendSecondsToMatchDuration(duration) {
  const secondsOffset = Math.floor(duration / 1000);
  if (seconds[seconds.length - 1] != secondsOffset) {
    seconds.push(secondsOffset);
    perSecondCount.push(0);
  }
}

document.getElementById("button").addEventListener("click", function () {
  const now = +new Date();
  if (lastPressTime > 0) {
    const elapsed = now - lastPressTime;
    lastTimeDisplay.textContent = elapsed;
    pressTimes.push(elapsed);
  }
  if (startTime < 0) {
    startTime = now;
  }
  lastPressTime = now;
  const numPresses = 1 + pressTimes.length;
  pressCountDisplay.textContent = numPresses;
  const totalDuration = now - startTime;
  meanTimeDisplay.textContent = (totalDuration / numPresses).toFixed(1);
  if (pressTimes.length) {
    extraStatsDiv.style.display = "";
  }
  extendSecondsToMatchDuration(totalDuration);
  perSecondCount[perSecondCount.length - 1]++;
  Plotly.newPlot(
    "button-press-histogram",
    [{ x: pressTimes, type: "histogram" }],
    {
      autosize: false,
      width: 800,
      xaxis: { title: { text: "Button press time (milliseconds)" } },
      yaxis: { title: { text: "Count per bucket" } },
    },
  );
});

setInterval(() => {
  timerDisplay.textContent = +new Date() - lastPressTime;
}, 50);

setInterval(() => {
  if (startTime < 0) {
    return;
  }
  const duration = +new Date() - startTime;
  durationDisplay.textContent = Math.floor(duration / 1000).toFixed(0);
  extendSecondsToMatchDuration(duration);
  Plotly.newPlot(
    "button-press-timeseries",
    [{ x: seconds, y: perSecondCount, type: "scatter" }],
    {
      autosize: false,
      width: 800,
      xaxis: { title: { text: "Seconds since start" } },
      yaxis: { title: { text: "Count per second" } },
    },
  );
}, 500);
