import { assetNumber } from "../../assets.js";
const imageCache = []
for (let i = 0; i < assetNumber.length; i++) {
  const img = new Image()
  img.src = assetNumber[i]
  imageCache.push(img)
}


const timer = document.getElementById("timer")
timer.height = 400
timer.width = 400
const timerContext = timer.getContext("2d")
const img = new Image()
img.addEventListener("onload", () => {
  timerContext.drawImage(img, 10, 10, 100, 100);

})
timerContext.fillStyle = "green"
timerContext.fillRect(10, 10, 64, 64)
img.scr = assetNumber[0]

const cavas = document.getElementById("canvas")
cavas.height = 420
cavas.width = 500

const ctx = cavas.getContext('2d')

function showTime() {
  const time = new Date();
  const hours = time.getHours();
  const min = time.getMinutes();
  const sec = time.getSeconds();
  const timerArr = [parseInt(hours / 10), hours % 10, 10, parseInt(min / 10), min % 10, 10, parseInt(sec / 10), sec % 10]

  for (let i = 0; i < timerArr.length; i++) {
    const img = imageCache[timerArr[i]]
    ctx.drawImage(img, i * 64, 0, 64, 64)
  }


}

const timePerFrame = 1000 / 30

let lastTime = null;
let acc = 0;

function animate(time) {
  if (lastTime === null) lastTime = time;

  const deltaTime = time - lastTime;
  lastTime = time;

  acc += deltaTime;

  while (acc >= timePerFrame) {
    acc -= timePerFrame;

  }
  ctx.clearRect(0, 0, cavas.width, cavas.height);
  showTime();
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);



class Timer {

  factor = 60;
  static state = {
    stop: 0,
    start: 1,
    reset: -1
  }
  default = 25
  constructor(hours, minutes, seconds, activeState) {
    this.time = hours * this.factor * this.factor + minutes * this.factor + seconds;
    this.activeState = activeState;
  }
  setTimer(hours, minutes, seconds) {
    this.time = hours * this.factor * this.factor + minutes * this.factor + seconds;
  }
  startTimer() {
    switch (this.activeState) {
      case Timer.state.start:
        if (this.activeState == Timer.state.start) {
          this.time--;
          setInterval(this.startTimer(), 1000)
          console.debug(this.time)
        }
        break;
      case Timer.state.reset:
        this.time = 25
        break;
      case Timer.state.stop:
        while (this.activeState == Timer.state.stop)
          break;
    }
  }


}





