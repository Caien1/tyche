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

//INFO:data defs
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
const theme = [{
  color: "#b4ada3",
  icon: 12,
}, {
  color: "#c4b1ae",
  icon: 13,
}, {
  color: "#b5b59e",
  icon: 14,
}]

//INFO:helpers short hand
const timer_handle = [timer_info.pomodoro, timer_info.short_break, timer_info.long_break]
const g_state_handle = [global_state.pomodoro, global_state.short_break, global_state.long_break]


//INFO:Functions
//
//INFO:State changing functions
function initTimer() {
  for (let i = 0; i < timer_handle.length; i++) {
    timer_handle[i].hh = parseInt(g_state_handle[i].hh) || 0;
    timer_handle[i].mm = parseInt(g_state_handle[i].mm) || 0;
    timer_handle[i].ss = parseInt(g_state_handle[i].ss) || 0;
  }

}
function loadSetting() {

  const user_settings = JSON.parse(localStorage.getItem("settings")) || global_state
  const user_setting_handle = [user_settings.pomodoro, user_settings.short_break, user_settings.long_break]
  for (let i = 0; i < timer_handle.length; i++) {
    g_state_handle[i].hh = parseInt(user_setting_handle[i].hh) || 0;
    g_state_handle[i].mm = parseInt(user_setting_handle[i].mm) || 0;
    g_state_handle[i].ss = parseInt(user_setting_handle[i].ss) || 0;
  }
}

function runTimer() {

  const now = new Date().getTime()
  const target = new Date(timer_handle[timer_info.mode].ms).getTime()
  const difference = (target - now) / 1000
  const current_time = timer_handle[timer_info.mode]
  current_time.hh = Math.floor((difference % (60 * 60 * 24)) / (60 * 60))
  current_time.mm = Math.floor((difference % (60 * 60)) / 60)
  current_time.ss = Math.floor(difference % 60)
  if (current_time.hh < 0 || current_time.mm < 0 || current_time.ss < 0) {
    current_time.hh = current_time.ss = current_time.mm = 0
    timer_info.started = false
  }
}

//INFO:Rendering Functions
function renderTimer() {
  //TODO:dynamically genrate and render timeArr
  let hours = parseInt(timer_handle[timer_info.mode].hh);
  let min = parseInt(timer_handle[timer_info.mode].mm);
  let sec = parseInt(timer_handle[timer_info.mode].ss);
  const timerArr = [parseInt(hours / 10), hours % 10, 10, parseInt(min / 10), min % 10, 10, parseInt(sec / 10), sec % 10]

  for (let i = 0; i < timerArr.length; i++) {
    const img = imageCache[timerArr[i]]
    ctx.drawImage(img, i * 64, 76, 64, 64)
  }


}


function renderModeAndTheme() {

  //TODO: create themes etc
  ctx.fillStyle = theme[timer_info.mode].color;
  ctx.fillRect(0, 0, cavas.width, cavas.height)
  ctx.drawImage(imageCache[theme[timer_info.mode].icon], 0, 0, 128, 64);
  //paused or not paused
}

//INFO:Event functions
function renderUIToggle() {
  if (!timer_info.started) {
    ctx.drawImage(imageCache[11], 192, 76 + 64, 128, 64)
  } else {
    ctx.drawImage(imageCache[15], 192, 76 + 64, 128, 64)
  }


}

const change_mode = () => {
  timer_info.started = false;
  timer_info.mode = (timer_info.mode + 1) % 3;
  toggle_current_timer();
  timer_info.started = false;
  mode.innerHTML = `mode: ${timer_info.mode}`
}

const toggle_current_timer = () => {

  timer_info.started = !timer_info.started
  timer_handle[timer_info.mode].ms = new Date().setSeconds(new Date().getSeconds() +
    (timer_handle[timer_info.mode].hh * Math.pow(60, 2) +
      timer_handle[timer_info.mode].mm * 60 +
      timer_handle[timer_info.mode].ss))

}

const detect_collison = (event) => {
  const scaleX = cavas.width / cavas.offsetWidth;
  const scaleY = cavas.height / cavas.offsetHeight;
  const rect = cavas.getBoundingClientRect()
  console.log(rect,)
  console.log(event.clientX, event.clientY)
  const x = (event.clientX - rect.left) * scaleX
  const y = (event.clientY - rect.top) * scaleY
  console.log(x, y)
  //TODO:check sprite
  if (x >= 192 && x <= 192 + 128) {
    if (y >= 147 && y <= 175) {
      console.log("BBOM")
      toggle_current_timer()
    }
  }


}
//INFO:Events listeners
const mode = document.getElementById("mode_changer")
mode.addEventListener("click", change_mode)

const toggle = document.getElementById("start_stop")
toggle.addEventListener("click", toggle_current_timer)

cavas.addEventListener("click", detect_collison)

const save = document.getElementById("save")
save.addEventListener("click", () => {
  global_state.pomodoro.hh = (document.getElementById("hour_inp").value) || global_state.pomodoro.hh
  global_state.pomodoro.mm = (document.getElementById("min_inp").value) || global_state.pomodoro.mm
  global_state.pomodoro.ss = (document.getElementById("sec_inp").value) || global_state.pomodoro.ss

  global_state.long_break.hh = document.getElementById("l_hour_inp").value || global_state.long_break.hh
  global_state.long_break.mm = document.getElementById("l_min_inp").value || global_state.long_break.mm
  global_state.long_break.ss = document.getElementById("l_sec_inp").value || global_state.long_break.ss

  global_state.short_break.hh = document.getElementById("s_hour_inp").value || global_state.short_break.hh
  global_state.short_break.mm = document.getElementById("s_min_inp").value || global_state.short_break.mm
  global_state.short_break.ss = document.getElementById("s_sec_inp").value || global_state.short_break.ss

  //INFO:this Inits the values
  initTimer()
  localStorage.removeItem("settings")
  localStorage.setItem("settings", JSON.stringify(global_state))

})



//INFO:Main Loop
loadSetting()
initTimer()

const timePerFrame = 1000 / 10
let lastTime = null;
let acc = 0;

function animate(time) {
  if (lastTime === null) lastTime = time;

  const deltaTime = time - lastTime;
  lastTime = time;

  acc += deltaTime;

  while (acc >= timePerFrame) {

    ///Think of doing some animations here
    acc -= timePerFrame;
  }

  renderModeAndTheme();
  renderUIToggle()

  if (timer_info.started) runTimer();
  renderTimer();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);




