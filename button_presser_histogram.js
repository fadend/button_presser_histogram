class ButtonPresser {
  constructor(parentElem) {
    this.pressCountDisplay = parentElem.querySelector(".button-press-count");
    this.timerDisplay = parentElem.querySelector(".milliseconds-timer");
    this.extraStatsDiv = parentElem.querySelector(".extra-stats");
    this.lastTimeDisplay = parentElem.querySelector(".last-time");
    this.meanTimeDisplay = parentElem.querySelector(".mean-time");
    this.durationDisplay = parentElem.querySelector(".duration");
    this.histogramElem = parentElem.querySelector(".button-press-histogram");
    this.timeseriesPlotElem = parentElem.querySelector(
      ".button-press-timeseries",
    );
    this.startTime = -1;
    this.lastPressTime = -1;
    this.pressTimes = [];
    this.perSecondCount = [0];
    this.seconds = [0];

    // Add event handling.
    parentElem
      .querySelector(".button")
      .addEventListener("click", () => this.handleClick());

    setInterval(() => {
      this.timerDisplay.textContent = +new Date() - this.lastPressTime;
    }, 50);

    setInterval(() => this.handleTick(), 500);
  }

  handleClick() {
    const now = +new Date();
    if (this.lastPressTime > 0) {
      const elapsed = now - this.lastPressTime;
      this.lastTimeDisplay.textContent = elapsed;
      this.pressTimes.push(elapsed);
    }
    if (this.startTime < 0) {
      this.startTime = now;
    }
    this.lastPressTime = now;
    const numPresses = 1 + this.pressTimes.length;
    this.pressCountDisplay.textContent = numPresses;
    const totalDuration = now - this.startTime;
    this.meanTimeDisplay.textContent = (totalDuration / numPresses).toFixed(1);
    // If we have data, show some extra stats.
    if (this.pressTimes.length) {
      this.extraStatsDiv.style.display = "";
    }
    this.extendSecondsToMatchDuration(totalDuration);
    this.perSecondCount[this.perSecondCount.length - 1]++;
    Plotly.newPlot(
      this.histogramElem,
      [{ x: this.pressTimes, type: "histogram" }],
      {
        autosize: false,
        width: 800,
        xaxis: { title: { text: "Button press time (milliseconds)" } },
        yaxis: { title: { text: "Count per bucket" } },
      },
    );
  }

  handleTick() {
    if (this.startTime < 0) {
      return;
    }
    const duration = +new Date() - this.startTime;
    this.durationDisplay.textContent = Math.floor(duration / 1000).toFixed(0);
    this.extendSecondsToMatchDuration(duration);
    Plotly.newPlot(
      this.timeseriesPlotElem,
      [{ x: this.seconds, y: this.perSecondCount, type: "scatter" }],
      {
        autosize: false,
        width: 800,
        xaxis: { title: { text: "Seconds since start" } },
        yaxis: { title: { text: "Count per second" } },
      },
    );
  }

  extendSecondsToMatchDuration(duration) {
    const secondsOffset = Math.floor(duration / 1000);
    if (this.seconds[this.seconds.length - 1] != secondsOffset) {
      this.seconds.push(secondsOffset);
      this.perSecondCount.push(0);
    }
  }
}

new ButtonPresser(document.body);
