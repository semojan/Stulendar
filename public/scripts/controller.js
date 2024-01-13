jalaliDatepicker.startWatch();
/*** navbar buttons functioning***/
let dailyBtn = document.getElementById("dailyBtn");
let weeklyBtn = document.getElementById("weeklyBtn");
let monthlyBtn = document.getElementById("monthlyBtn");

dailyBtn.addEventListener("click", () => {
  document.querySelector(".fc-timeGridDay-button").click();
  dailyBtn.classList.add("nav-btn-clicked");
  weeklyBtn.classList.remove("nav-btn-clicked");
  monthlyBtn.classList.remove("nav-btn-clicked");
});
weeklyBtn.addEventListener("click", () => {
  document.querySelector(".fc-timeGridWeek-button").click();
  weeklyBtn.classList.add("nav-btn-clicked");
  dailyBtn.classList.remove("nav-btn-clicked");
  monthlyBtn.classList.remove("nav-btn-clicked");
});
monthlyBtn.addEventListener("click", () => {
  document.querySelector(".fc-dayGridMonth-button").click();
  monthlyBtn.classList.add("nav-btn-clicked");
  dailyBtn.classList.remove("nav-btn-clicked");
  weeklyBtn.classList.remove("nav-btn-clicked");
});

/*** add event/class buttons functions ***/
const wrapper = document.querySelector(".wrapper");
wrapper.addEventListener("click", wrapperToggle);

function wrapperToggle() {
  wrapper.classList.toggle("active");
  document.querySelector(".bg-layer").classList.toggle("bg-layer-active");
}

/*** add curriculum button function ***/
const addCurriculum = document.getElementById("addCurriculumBtn");
addCurriculum.addEventListener("click", () => {
  document.querySelector("#classModule h1").innerHTML = "ایجاد برنامه درسی";
  document.querySelector('#classForm input[type="submit"]').value = "ثبت";
  document.getElementById("moduleBg").classList.remove("display-none");
  document.getElementById("classModule").classList.remove("display-none");
});

/*** add Event button function ***/
const addEventBtn = document.getElementById("addEventBtn");
addEventBtn.addEventListener("click", () => {
  // change the value of header and submit button of module
  document.querySelector("#eventModule h1").innerHTML = "ایجاد رویداد جدید";
  document.querySelector('#eventForm input[type="submit"]').value =
    "ثبت رویداد";
  document.getElementById("moduleBg").classList.remove("display-none");
  document.getElementById("eventModule").classList.remove("display-none");
});

/*** add time schedule button function ***/
const addScheduleBtn = document.getElementById("addSchedule");
addScheduleBtn.addEventListener("click", () => {
  addScheduleBox();
});

function addScheduleBox() {
  let inputGroup = document.querySelector("#inputGroup");
  const inputGroupClone = inputGroup.content.cloneNode(true);
  let timeScheduleBox = document.getElementById("timeScheduleBox");
  timeScheduleBox.appendChild(inputGroupClone);
  return timeScheduleBox.lastElementChild;
}

/*** form cancel button function ***/
const cancelBtns = document.querySelectorAll("#cancelBtn");
Object.values(cancelBtns).forEach((btn) => {
  btn.addEventListener("click", closeModule);
});

function closeModule() {
  document.getElementById("moduleBg").classList.add("display-none");
  document.getElementById("eventModule").classList.add("display-none");
  document.getElementById("classModule").classList.add("display-none");
  wrapper.classList.remove("active");
  document.querySelector(".bg-layer").classList.remove("bg-layer-active");
}
