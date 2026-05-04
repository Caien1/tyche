import { assetNumber } from "../../assets.js";
const imageCache = []
for (let i = 0; i < assetNumber.length; i++) {
  const img = new Image()
  img.src = assetNumber[i]
  imageCache.push(img)
}
const timer_info = {
  hh: 0,
  mm: 0,
  ss: 0,
  started: false,
  ms: 60000,
}

const toggle = document.getElementById("start_stop")
toggle.addEventListener("click", () => {

  timer_info.ms = new Date().setSeconds(new Date().getSeconds() +
    (timer_info.hh * Math.pow(60, 2) + timer_info.mm * 60 + timer_info.ss))
  if (timer_info.started) {
    toggle.innerHTML = "Start"
    timer_info.started = false
  } else {

    toggle.innerHTML = "Stop"
    timer_info.started = true
  }
})
//
// const setting = document.getElementById("setting");
// setting.addEventListener("click", () => {
//   console.log("Setting")
// })
const save = document.getElementById("save")
save.addEventListener("click", () => {

  timer_info.hh = parseInt(document.getElementById("hour_inp").value)
  timer_info.mm = parseInt(document.getElementById("min_inp").value)
  timer_info.ss = parseInt(document.getElementById("sec_inp").value)
  timer_info.started = false
  if (!timer_info.hh) { timer_info.hh = 0 }
  if (!timer_info.mm) { timer_info.mm = 0 }
  if (!timer_info.ss) { timer_info.ss = 0 }



  timer_info.ms = new Date().setSeconds(new Date().getSeconds() +
    (timer_info.hh * Math.pow(60, 2) + timer_info.mm * 60 + timer_info.ss))
})

const cavas = document.getElementById("canvas")
const ctx = cavas.getContext('2d')
cavas.height = 216;
cavas.width = 512;

function runTimer() {
  const now = new Date().getTime()
  const target = new Date(timer_info.ms).getTime()
  const difference = (target - now) / 1000
  timer_info.hh = Math.floor((difference % (60 * 60 * 24)) / (60 * 60))
  timer_info.mm = Math.floor((difference % (60 * 60)) / 60)
  timer_info.ss = Math.floor(difference % 60)
}


function renderTimer() {
  let hours = timer_info.hh;
  let min = timer_info.mm;
  let sec = timer_info.ss;
  if (hours < 0 || min < 0 || sec < 0) {
    hours = min = sec = 0
    timer_info.started = false
  }
  let timerArr = [parseInt(hours / 10), hours % 10, 10, parseInt(min / 10), min % 10, 10, parseInt(sec / 10), sec % 10]




  for (let i = 0; i < timerArr.length; i++) {
    const img = imageCache[timerArr[i]]
    ctx.drawImage(img, i * 64, 76, 64, 64)
  }



}
const timePerFrame = 1000 / 15

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
  ctx.fillStyle = "#005050";

  ctx.fillRect(0, 0, cavas.width, cavas.height);
  if (timer_info.started) {
    runTimer();
  }
  renderTimer();
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);




