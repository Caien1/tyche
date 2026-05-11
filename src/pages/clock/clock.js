import { assetNumber } from "../../assets.js";



const imageCache = []
for (let i = 0; i < assetNumber.length; i++) {
  const img = new Image()
  img.src = assetNumber[i]
  imageCache.push(img)
}

// const palette = [{ "Silver": "c4b1ae", "Silver 2": "b4ada3", "Khaki Beige": "bfb59e", "Khaki Beige 2": "cab7a2", "Grey Olive": "858786" }];

const cavas = document.getElementById("canvas")
const ctx = cavas.getContext('2d')
cavas.height = 216;
cavas.width = 512;


const timer_info = {
  mode: 0, // current modes 3

  pomodoro: {
    hh: 0,
    mm: 0,
    ss: 0,
    ms: 0,
  },
  short_break: {
    hh: 0,
    mm: 0,
    ss: 0,
    ms: 0,
  },
  //
  long_break: {
    hh: 0,
    mm: 0,
    ss: 0,
    ms: 0,
  },

  started: false,
  finished: false,
  //
}


const global_state = {
  pomodoro: {
    hh: 0,
    mm: 25,
    ss: 0,
  },
  short_break: {
    hh: 0,
    mm: 5,
    ss: 0,
  },
  long_break: {
    hh: 0,
    mm: 15,
    ss: 0,
  }


}


const timer_handle = [timer_info.pomodoro, timer_info.short_break, timer_info.long_break]

function initTimer() {
  timer_handle[0].hh = parseInt(global_state.pomodoro.hh) ?? 0;
  timer_handle[0].mm = parseInt(global_state.pomodoro.mm) ?? 0;
  timer_handle[0].ss = parseInt(global_state.pomodoro.ss) ?? 0;


}
const mode = document.getElementById("mode_changer")
mode.addEventListener("click", () => {
  timer_info.started = false
  timer_info.mode = (timer_info.mode + 1) % 3;
  timer_info.started = true;
})
const toggle = document.getElementById("start_stop")
toggle.addEventListener("click", () => {

  timer_handle[timer_info.mode].ms = new Date().setSeconds(new Date().getSeconds() +
    (timer_handle[timer_info.mode].hh * Math.pow(60, 2) +
      timer_handle[timer_info.mode].mm * 60 +
      timer_handle[timer_info.mode].ss))

  console.log(timer_handle[timer_info.mode].ms)
  timer_info.started = true;
})

const save = document.getElementById("save")
save.addEventListener("click", () => {
  global_state.pomodoro.hh = document.getElementById("hour_inp").value ?? global_state.pomodoro.hh
  global_state.pomodoro.mm = document.getElementById("min_inp").value ?? global_state.pomodoro.mm
  global_state.pomodoro.ss = document.getElementById("sec_inp").value ?? global_state.pomodoro.mm

  global_state.long_break.hh = document.getElementById("l_hour_inp").value ?? global_state.long_break.hh
  global_state.long_break.mm = document.getElementById("l_min_inp").value ?? global_state.long_break.mm
  global_state.long_break.ss = document.getElementById("l_sec_inp").value ?? global_state.long_break.ss

  global_state.short_break.hh = document.getElementById("s_hour_inp").value ?? global_state.short_break.hh
  global_state.short_break.mm = document.getElementById("s_min_inp").value ?? global_state.short_break.mm
  global_state.short_break.ss = document.getElementById("s_min_inp").value ?? global_state.short_break.ss

  initTimer()

})

function runTimer() {

  const now = new Date().getTime()
  const target = new Date(timer_handle[timer_info.mode].ms).getTime()
  const difference = (target - now) / 1000
  timer_handle[timer_info.mode].hh = Math.floor((difference % (60 * 60 * 24)) / (60 * 60))
  timer_handle[timer_info.mode].mm = Math.floor((difference % (60 * 60)) / 60)
  timer_handle[timer_info.mode].ss = Math.floor(difference % 60)
}

function renderTimer() {
  if (!timer_info.started) {
    ctx.drawImage(imageCache[11], 0, 0, 512, 64)
  }
  let hours = parseInt(timer_handle[timer_info.mode].hh);
  let min = parseInt(timer_handle[timer_info.mode].mm);
  let sec = parseInt(timer_handle[timer_info.mode].ss);
  if (hours < 0 || min < 0 || sec < 0) {
    hours = min = sec = 0
    timer_info.started = false
  }
  console.log(hours, min, sec)
  const timerArr = [parseInt(hours / 10), hours % 10, 10, parseInt(min / 10), min % 10, 10, parseInt(sec / 10), sec % 10]

  for (let i = 0; i < timerArr.length; i++) {
    const img = imageCache[timerArr[i]]
    ctx.drawImage(img, i * 64, 76, 64, 64)
  }


}


function renderModeAndTheme() {
  //TODO: create themes etc
  switch (timer_info.mode) {
    case 0:
      ctx.drawImage(imageCache[12], 0, 0, 128, 64);
      ctx.fillStyle = "#b4ada3";
      ctx.fillRect(0, 0, cavas.width, cavas.height)
      break;
    case 1:
      ctx.fillStyle = "#c4b1ae";
      ctx.fillRect(0, 0, cavas.width, cavas.height)
      ctx.drawImage(imageCache[13], 0, 0, 128, 64);
      break;
    case 2:

      ctx.fillStyle = "#b5b59e";
      ctx.fillRect(0, 0, cavas.width, cavas.height)
      ctx.drawImage(imageCache[14], 0, 0, 128, 64);
      break;
  }

}



const timePerFrame = 1000 / 10
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

  renderModeAndTheme();
  if (timer_info.started) runTimer();
  renderTimer();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);




