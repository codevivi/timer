"use strict";
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
const progressBar = document.querySelector(".progress-bar");
///elements
///variables
let defaultTimer = {
  s: 7,
  m: 0,
  h: 0,
};
let sound = new Audio("./assets/wake-up-call.mp3");
let isSoundOn = false;
let isPlayingSound = false;
let s = defaultTimer.s;
let m = defaultTimer.m;
let h = defaultTimer.h;
let allInSeconds = h * 3600 + m * 60 + s;
let allInSecondsDefault = allInSeconds;
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
  if (multiPurposeBtn.classList.contains("invalid")) {
    multiPurposeBtn.classList.remove("invalid");
  }
  isInSetTime = true;
  pause();
  this.classList.add("hidden");
  inputsForm.classList.remove("hidden");
}

function timerAction(e) {
  //on submit or submit button stop/start
  e.preventDefault();
  if (isEndOfTimer) {
    removeEndOfTimer();
  }
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
function updateProgressBar() {
  let progressWidth = ((allInSecondsDefault - allInSeconds) * 100) / allInSecondsDefault;
  console.log(progressWidth, "progressbar");
  progressBar.style.width = `${progressWidth}%`;
}
function startTimer() {
  isPaused = false;
  updateProgressBar();
  multiPurposeBtn.textContent = "Stop";
  if (allInSeconds === 0) {
    sEl.innerHTML = `0<small>s</small>`;
    sEl.innerHTML = `0<small>s</small>`;
    multiPurposeBtn.classList.add("invalid");
    return;
  }
  intervalId = setInterval(() => {
    updateProgressBar();
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
  if (isSoundOn) {
    isPlayingSound = true;
    sound.play();
  }
  isEndOfTimer = true;
}
function removeEndOfTimer() {
  isEndOfTimer = false;
  if (isPlayingSound) {
    sound.pause();
  }
}
function resetTimer() {
  if (multiPurposeBtn.classList.contains("invalid")) {
    multiPurposeBtn.classList.remove("invalid");
  }
  if (isEndOfTimer) {
    removeEndOfTimer();
  }
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
  h = inputH;
  defaultTimer.h = h;
  m = inputM;
  defaultTimer.m = m;
  s = inputS;
  defaultTimer.s = s;
  allInSecondsDefault = allInSeconds;
  displayInitialTimerValues();

  updateProgressBar();
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
    ///have to start and immediately stop on click to activate first time
    //if already playing don not stop
    sound.play();
    sound.pause();
    if (!isPlayingSound && isEndOfTimer) {
      isPlayingSound = true;
      sound.play();
    }
    soundBtn.innerHTML = `<i class=" fa fa-volume-up" aria-hidden="true"></i>`;
    return;
  }

  isSoundOn = false;
  if (isPlayingSound) {
    sound.pause(); //if already playing
    isPlayingSound = false;
  }
  soundBtn.innerHTML = `<i class=" fa fa-volume-off" aria-hidden="true"></i>`;
}

function isNumberKey(evt) {
  console.log(evt);
  var charCode = evt.charCode;
  if (charCode < 48 || charCode > 57) return false;
  console.log(evt.target.value);
  if (evt.target.value + evt.key > 99) return false;

  return true;
}
