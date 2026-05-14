import { assetNumber, IMAGE_ENUM } from "../../assets.js";


//TODO: verify if all imgs are loaded
const imageCache = []
for (let i = 0; i < assetNumber.length; i++) {
  const img = new Image()
  img.src = assetNumber[i]
  imageCache.push(img)
}



const cavas = document.getElementById("canvas")
const ctx = cavas.getContext('2d')
cavas.height = 216;
cavas.width = 512;

//INFO:data defs
//
//WARN:There appears to be a bug that messes up the hr feild of pomodoro figure it out
const timer_handle = [{
  name: "pomodoro",
  hh: 0,
  mm: 0,
  ss: 0,
  ms: 0,
}, {
  name: "short_break",
  hh: 0,
  mm: 0,
  ss: 0,
  ms: 0,
}, {
  name: "long_break",
  hh: 0,
  mm: 0,
  ss: 0,
  ms: 0,
}]


const timer_info = {
  mode: 0,
  started: false,
  finished: false,
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
  color: "#03A062",
  icon: IMAGE_ENUM.POMO,
}, {
  color: "#462C7D",
  icon: IMAGE_ENUM.SHORT_BREAK,
}, {
  color: "#59B292",
  icon: IMAGE_ENUM.LONG_BREAK,
}]

const uiElements = {

  //TODO:Fix the sprites and make a function named resolve collision of update ui which ittrates through aa ui etc etc
  // & need a robust anchoring system this currently is trash
  //
  pause_run: { x: 192, y: 76 + 96, w: 128, h: 32 },
  mode_rect: { x: 0, y: 0, w: 100, h: 64 },
  //WARN: the x = 0 if rendered but its usage in loop make it a bit different 
  digit_rect: { x: 64, y: 76, w: 64, h: 64 },
  next_mode: { x: 100, y: 0, w: 32, h: 64 },
}



//INFO: helpers short hand
//
//TODO:these two (now 1) shall not exists the fact that this exist => the data modelling of core is trash.. figure something out wait* 1 resolved
const g_state_handle = [global_state.pomodoro, global_state.short_break, global_state.long_break]

const timerArr = new Int8Array(8)

//INFO: custom click event queue on the canvas for UI interaction 

const clickQueue = new Float32Array(32)
let clickQueueHead = 0
let clickQueueTail = 0
let no_of_events = 0

//WARN:there is now overflow handling the fact we can play the dont start more tan 16 events in a fram
const add_event_queue = (x, y) => {
  clickQueue[clickQueueHead] = x
  clickQueue[clickQueueHead + 1] = y
  no_of_events += 1
  clickQueueHead = (clickQueueHead + 2) % 32
}

const resolve_events = () => {
  while (no_of_events > 0) {
    detect_collision(clickQueue[clickQueueTail], clickQueue[clickQueueTail + 1])
    clickQueueTail = (clickQueueTail + 2) % 32
    no_of_events -= 1
  }
}
const check_collision = (x, y, rect) => {
  if (x >= rect.x && x <= rect.x + rect.w) {
    if (y >= rect.y && y <= rect.y + rect.h) {
      return true
    }
  }
  return false
}
const detect_collision = (x, y) => {

  if (check_collision(x, y, uiElements.pause_run)) {
    toggle_current_timer()
  }

  if (check_collision(x, y, uiElements.next_mode)) {
    change_mode()
  }



}

//INFO:Functions
//INFO:State changing functions
function initTimer() {
  //TODO:move these parseInts to dom(event listener)
  for (let i = 0; i < timer_handle.length; i++) {
    timer_handle[i].hh = parseInt(g_state_handle[i].hh) || 0;
    timer_handle[i].mm = parseInt(g_state_handle[i].mm) || 0;
    timer_handle[i].ss = parseInt(g_state_handle[i].ss) || 0;
  }

}

function loadSetting() {
  //TODO:add versioning and defaults etc
  const user_settings = JSON.parse(localStorage.getItem("settings")) || global_state
  const user_setting_handle = [user_settings.pomodoro, user_settings.short_break, user_settings.long_break]
  for (let i = 0; i < timer_handle.length; i++) {
    g_state_handle[i].hh = user_setting_handle[i].hh || 0;
    g_state_handle[i].mm = user_setting_handle[i].mm || 0;
    g_state_handle[i].ss = user_setting_handle[i].ss || 0;
  }
}
function calculateTimerSprites() {

  const current_time = timer_handle[timer_info.mode]
  let hours = (current_time.hh);
  let min = (current_time.mm);
  let sec = (current_time.ss);
  timerArr[0] = (hours / 10) | 0
  timerArr[1] = hours % 10
  timerArr[2] = IMAGE_ENUM.COLON
  timerArr[3] = (min / 10) | 0
  timerArr[4] = min % 10
  timerArr[5] = IMAGE_ENUM.COLON
  timerArr[6] = (sec / 10) | 0
  timerArr[7] = sec % 10



}
function runTimer() {
  const now = Date.now()
  const target = (timer_handle[timer_info.mode].ms)
  const difference = (target - now) / 1000
  const current_time = timer_handle[timer_info.mode]
  current_time.hh = ((difference % (60 * 60 * 24)) / (60 * 60)) | 0
  current_time.mm = ((difference % (60 * 60)) / 60) | 0
  current_time.ss = (difference % 60) | 0

  if (current_time.hh < 0 || current_time.mm < 0 || current_time.ss < 0) {
    current_time.hh = current_time.ss = current_time.mm = 0
    timer_info.started = false
    timer_info.finished = true
  }
}

//INFO:Rendering Functions
function renderTimer() {
  //TODO:dynamically genrate and render timeArr
  for (let i = 0; i < timerArr.length; i++) {
    const img = imageCache[timerArr[i]]
    ctx.drawImage(img, i * uiElements.digit_rect.x,
      uiElements.digit_rect.y,
      uiElements.digit_rect.w,
      uiElements.digit_rect.h)
  }


}


function renderModeAndTheme() {

  ctx.fillStyle = theme[timer_info.mode].color;
  ctx.fillRect(0, 0, cavas.width, cavas.height)
  ctx.drawImage(imageCache[theme[timer_info.mode].icon],
    uiElements.mode_rect.x,
    uiElements.mode_rect.y,
    uiElements.mode_rect.w,
    uiElements.mode_rect.h);
  //paused or not paused
}

//INFO:Event functions
function renderUIElements() {
  if (!timer_info.started) {
    ctx.drawImage(imageCache[IMAGE_ENUM.PAUSED],
      uiElements.pause_run.x,
      uiElements.pause_run.y,
      uiElements.pause_run.w,
      uiElements.pause_run.h)
  } else {
    ctx.drawImage(imageCache[IMAGE_ENUM.RUN],
      uiElements.pause_run.x,
      uiElements.pause_run.y,
      uiElements.pause_run.w,
      uiElements.pause_run.h)
  }

  //next button

  ctx.drawImage(imageCache[IMAGE_ENUM.NEXT_MODE],
    uiElements.next_mode.x,
    uiElements.next_mode.y,
    uiElements.next_mode.w,
    uiElements.next_mode.h)




}

const change_mode = () => {
  timer_info.started = false;
  timer_info.mode = (timer_info.mode + 1) % 3;
  toggle_current_timer();
  timer_info.started = false;
}

const toggle_current_timer = () => {

  timer_info.started = !timer_info.started
  timer_handle[timer_info.mode].ms = new Date().setSeconds(new Date().getSeconds() +
    (timer_handle[timer_info.mode].hh * Math.pow(60, 2) +
      timer_handle[timer_info.mode].mm * 60 +
      timer_handle[timer_info.mode].ss))

}

const get_mouse_coord = (event) => {
  const rect = cavas.getBoundingClientRect()
  const x = (event.clientX - rect.left)
  const y = (event.clientY - rect.top)
  add_event_queue(x, y)


}

//INFO:Events listeners


cavas.addEventListener("mousedown", get_mouse_coord)

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



//INFO:Init stuff required 
//
loadSetting()
initTimer()


//INFO:Main LOOP
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



  if (no_of_events > 0) {
    resolve_events()
  }
  //INFO:Calculate / state chaning ops 
  if (timer_info.started) {
    runTimer();
  }
  calculateTimerSprites()
  //INFO:Render after this
  renderModeAndTheme();
  renderUIElements()
  renderTimer();

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);




