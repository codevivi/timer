"use strict";
/////todo
//alow only numbers, check on input
///elements
const timerEl = document.getElementById("timer");
const hEl = document.getElementById("leftH");
const mEl = document.getElementById("leftM");
const sEl = document.getElementById("leftS");
const inputsEl = document.getElementById("inputs");
const inputsForm = document.getElementById("input-form");
const sInput = document.querySelector("#s");
const mInput = document.querySelector("#m");
const hInput = document.querySelector("#h");
const soundBtn = document.querySelector("#toggle-sound");
const resetBtn = document.querySelector("#reset");
const multiPurposeBtn = document.querySelector('button[form="input-form"]');
///elements
///variables
let defaultTimer = {
  s: 7,
  m: 0,
  h: 0,
};
let sound = new Audio("./assets/wake-up-call.mp3");
let isSoundOn = false;
let s = defaultTimer.s;
let m = defaultTimer.m;
let h = defaultTimer.h;
let allInSeconds = h * 3600 + m * 60 + s;
let isPaused = false;
let isInSetTime = false;
let isEndOfTimer = false;
let isInInput = false;
let intervalId = null;

///variables

///event listeners
soundBtn.addEventListener("click", toggleSound);
timerEl.addEventListener("click", enterTime);
inputsForm.addEventListener("submit", timerAction); //multipurposeBtn
resetBtn.addEventListener("click", resetTimer);
///event listeners

//start timer
setTimerValues(defaultTimer);
startTimer();
//start timer

///functions
function enterTime() {
  isInSetTime = true;
  pause();
  this.classList.add("hidden");
  inputsForm.classList.remove("hidden");
}

function timerAction(e) {
  //on submit or submit button stop/start
  e.preventDefault();
  if (isInSetTime) {
    //will always be paused
    let inputs = getFormData(inputsForm);
    setTimerValues(inputs);
    isInSetTime = false;
    this.classList.add("hidden");
    timerEl.classList.remove("hidden");
    startTimer();
    return;
  }
  if (isPaused) {
    startTimer();
    return;
  }
  pause();
}
function pause() {
  isPaused = true;
  clearInterval(intervalId);
  intervalId = null;
  multiPurposeBtn.textContent = "Start";
  sInput.value = s;
  mInput.value = m;
  hInput.value = h;
}
function startTimer() {
  isPaused = false;
  multiPurposeBtn.textContent = "Stop";
  intervalId = setInterval(() => {
    if (allInSeconds <= 0) {
      clearInterval(intervalId);
      sEl.innerHTML = `0<small>s</small>`;
      endOfTimer();
      return;
    }
    if (m >= 0 && s >= 0) {
      sEl.innerHTML = `${m ? pad0(s) : s}<small>s</small>`;
      s--;
    } else if (s < 0 && m > 0) {
      s = 59;
      m--;
      sEl.innerHTML = `${s}<small>s</small>`;
      if (m > 0) {
        mEl.innerHTML = `${h > 0 ? pad0(m) : m}<small>m</small>`;
      } else {
        mEl.innerHTML = ``;
      }
    } else if (s < 0 && m < 0 && h > 0) {
      s = 59;
      sEl.innerHTML = `${s}<small>s</small>`;
      m--;
      mEl.innerHTML = `${pad0(m)}<small>m</small>`;
      h--;
      hEl.innerHTML = `${h}<small>h</small>`;
    }

    allInSeconds--;
  }, 1000);
}

function endOfTimer() {
  m = 0;
  s = 0;
  h = 0;

  hEl.innerHTML = ``;
  mEl.innerHTML = ``;
  sEl.innerHTML = `0<small>s</small>`;
  if (isSoundOn) {
    sound.play();
  }
  multiPurposeBtn.textContent = "stop";
  isEndOfTimer = true;
}
function resetTimer() {
  if (!isPaused) {
    //as might be paused if in time settings
    pause();
  }
  sInput.value = defaultTimer.s;
  mInput.value = defaultTimer.m;
  hInput.value = defaultTimer.h;
  setTimerValues(defaultTimer);
}
function setTimerValues(inputs) {
  ////first make sure you allow only numbers on input
  let inputH = Number(inputs.h);
  let inputM = Number(inputs.m);
  let inputS = Number(inputs.s);
  if (!inputH && !inputM && !inputS) {
    //// ? use default?
    return;
  }
  allInSeconds = inputS + inputM * 60 + inputH * 3600;
  if (inputS > 60) {
    let sSave = inputS;
    inputM += Math.floor(inputS / 60);
    inputS = sSave % 60;
  }
  if (inputM > 60) {
    let mSave = inputM;
    inputH += Math.floor(inputM / 60);
    inputM = mSave % 60;
  }
  //   console.log(inputH, "h", inputM, "m", inputS, "s");
  h = inputH;
  defaultTimer.h = h;
  m = inputM;
  defaultTimer.m = m;
  s = inputS;
  defaultTimer.s = s;
  displayInitialTimerValues();
}
function pad0(num) {
  let str = num.toString();
  if (str.length < 2) {
    str = "0" + str;
  }
  return str;
}
function getFormData(form) {
  const formData = new FormData(form);
  let data = {};
  for (const [key, value] of formData) {
    data[key] = value;
  }
  return data;
}
function displayInitialTimerValues() {
  if (s && !m && !h) {
    sEl.innerHTML = `${s}<small>s</small>`;
  } else if (m && !h) {
    mEl.innerHTML = `${m}<small>m</small>`;
    sEl.innerHTML = `${pad0(s)}<small>s</small>`;
  }
  if (h) {
    hEl.innerHTML = `${h}<small>h</small>`;
    mEl.innerHTML = `${pad0(m)}<small>m</small>`;
    sEl.innerHTML = `${pad0(s)}<small>s</small>`;
  }
}
function toggleSound() {
  if (!isSoundOn) {
    isSoundOn = true;
    //as not allowed if user not activated... is there a better way?
    sound.play();
    sound.pause();
    soundBtn.innerHTML = `<i class=" fa fa-volume-up" aria-hidden="true"></i>`;
    return;
  }

  isSoundOn = false;
  soundBtn.innerHTML = `<i class=" fa fa-volume-off" aria-hidden="true"></i>`;
}
