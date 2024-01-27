let events = [
    {
      groupId: 1,
      id: 1,
      title: "my recurring event",
      color: "#a275c5",
      rrule: {
        freq: "weekly",
        interval: 1,
        byweekday: ["mo"],
        dtstart: "2024-01-01T08:30:00",
        until: "2024-02-10",
      },
    },
    //class event
    {
      groupId: 1,
      id: 2,
      title: "my recurring event",
      color: "#a275c5",
      rrule: {
        freq: "weekly",
        interval: 2,
        byweekday: ["mo"],
        dtstart: "2024-01-01T10:00:00",
        until: "2024-02-10",
      },
    },
    //Event
    {
      groupId: 1,
      id: 3,
      color: "#a275c5",
      title: "Ex of my recurring event",
      start: "2024-02-29T08:00:00",
      description: "nothing special",
    },
  ],
  calendar;

document.addEventListener("DOMContentLoaded", initCalendar());

async function initCalendar() {
  //geting the data from server
  let eventDatas = await fetchEvents();
  let courseDatas = await fetchCourses();
  let allDatas = { ...eventDatas, ...courseDatas };

  //getting ratio of container for fitting calendar
  let container = document.getElementById("calendarSection");
  let containerWidth = container.offsetWidth;
  let containerHeight = container.offsetHeight;
  let ratio = containerWidth / containerHeight;

  //getting current date
  let currentDate = new Date();

  var calendarEl = document.getElementById("calendar");
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialDate: Date.parse(currentDate),
    locale: "fa",
    headerToolbar: {
      left: "prev, today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,next",
    },

    eventClick: function (info) {
      let infoBox = document.getElementById("EinfoModule");
      const infoBoxClone = infoBox.content.cloneNode(true);
      infoBoxClone.getElementById("eventColor").style.background =
        info.event.backgroundColor;
      infoBoxClone.querySelector(".eventTitle h1").innerHTML = info.event.title;
      infoBoxClone.querySelector(".eventDateTime").innerHTML = changeDateLocale(
        info.event.start
      );

      let moduleBg = document.getElementById("moduleBg");

      moduleBg.appendChild(infoBoxClone);
      moduleBg.classList.remove("display-none");

      closeInfoModule();
      deleteEventBtn(info.event);

      //edit button
      let editBtn = document.getElementById("editEvent");
      editBtn.addEventListener("click", async () => {
        removeInfoModule();

        if (info.event.groupId === "null" || info.event.groupId === "") {
          updateEventForm(info.event);
        } else {
          let courseData = await fetchCourses();
          let clickedEvent = Object.values(courseData).filter(
            (course) => `${course.groupId}` === info.event.groupId
          );
          let eventData = await fetchEvents();
          let exEvent = Object.values(eventData).filter(
            (event) => `${event.groupId}` === info.event.groupId
          );
          Promise.resolve(updateClassForm(clickedEvent, exEvent[0])).then(() =>
            AddUpdatedEvent()
          );
        }
      });
    },
  });

  calendar.setOption("aspectRatio", ratio + 0.05);
  Object.values(allDatas).forEach((data) => {
    delete Object.assign(data, { id: data._id })["_id"];
    addEvent(data);
  });
  calendar.render();
}

function changeDateLocale(date) {
  const myEventDate = new Date(date);

  const locale = "fa-IR";

  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  return myEventDate.toLocaleDateString(locale, options);
}

//1.971995

/*** convert persian digits into english ***/
String.prototype.toEnglishDigits = function () {
  var num_dic = {
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
  };

  return parseInt(
    this.replace(/[۰-۹]/g, function (w) {
      return num_dic[w];
    })
  );
};

/*** take form data and convert to object ***/
const eventForm = document.getElementById("eventForm");
eventForm.addEventListener("submit", (e) => {
  e.preventDefault();
  eventSubmit(eventForm);
});

async function eventSubmit(form) {
  let event = Object.fromEntries(new FormData(form));
  let dateArray = event.start.split("/");
  let date = jalaali.toGregorian(
    parseInt(dateArray[0].toEnglishDigits()),
    parseInt(dateArray[1].toEnglishDigits()),
    parseInt(dateArray[2].toEnglishDigits())
  );
  date =
    `${date.gy}-${String(date.gm).padStart(2, "0")}-${String(date.gd).padStart(
      2,
      "0"
    )}` +
    "T" +
    event.eventTime;

  let newEvent = {
    title: event.title,
    start: date,
    color: event.eventColor,
    description: event.eventDescription,
  };

  newEvent = await POSTData(newEvent, "events");
  addEvent(newEvent);
  closeModule();
  form.reset();
}

const classForm = document.getElementById("classForm");
classForm.addEventListener("submit", (e) => {
  e.preventDefault();
  classFormSubmit(classForm);
});

async function classFormSubmit(form) {
  let classEvent = Object.fromEntries(new FormData(form));
  let dateArray = classEvent.exDate.split("/");
  let exDate = jalaali.toGregorian(
    parseInt(dateArray[0].toEnglishDigits()),
    parseInt(dateArray[1].toEnglishDigits()),
    parseInt(dateArray[2].toEnglishDigits())
  );
  exDate =
    `${exDate.gy}-${String(exDate.gm).padStart(2, "0")}-${String(
      exDate.gd
    ).padStart(2, "0")}` +
    "T" +
    classEvent.exTime;

  let scheduleForm = document.querySelectorAll("#timeScheduleBox #IG");
  let groupId = calendar.getEvents().length;
  Object.values(scheduleForm).forEach(async (Sform) => {
    let inputGroup = Object.fromEntries(new FormData(Sform));
    dateArray = inputGroup.classSDate.split("/");
    let startDate = jalaali.toGregorian(
      parseInt(dateArray[0].toEnglishDigits()),
      parseInt(dateArray[1].toEnglishDigits()),
      parseInt(dateArray[2].toEnglishDigits())
    );
    startDate = `${startDate.gy}-${String(startDate.gm).padStart(
      2,
      "0"
    )}-${String(startDate.gd).padStart(2, "0")}`;

    let weekday = new Date(startDate);

    let dateArray2 = classEvent.classEndDate.split("/");
    let endDate = jalaali.toGregorian(
      parseInt(dateArray2[0].toEnglishDigits()),
      parseInt(dateArray2[1].toEnglishDigits()),
      parseInt(dateArray2[2].toEnglishDigits())
    );

    endDate = `${endDate.gy}-${String(endDate.gm).padStart(2, "0")}-${String(
      endDate.gd
    ).padStart(2, "0")}`;

    let course = {
      groupId: groupId,
      color: classEvent.eventColor,
      title: classEvent.classTitle,
      rrule: {
        freq: "weekly",
        interval: inputGroup.repeatInput == "everyWeek" ? 1 : 2,
        byweekday: [weekday.toString().slice(0, 2)],
        dtstart: startDate + "T" + inputGroup.classTime,
        until: endDate,
      },
    };

    course = await POSTData(course, "courses");
    addEvent(course);
  });

  let exam = {
    groupId: groupId,
    color: classEvent.eventColor,
    title: `امتحان ${classEvent.classTitle}`,
    start: exDate,
  };

  exam = await POSTData(exam, "events");
  addEvent(exam);
  closeModule();
  removeInputGroup();
  form.reset();
}

/*** remove input group from class form ***/
function removeInputGroup() {
  let inputGroups = document.querySelectorAll("#IG");
  let parent = document.getElementById("timeScheduleBox");
  Object.values(inputGroups).forEach((child) => {
    parent.removeChild(child);
  });
}

/*** Add event to calendar ***/
function addEvent(event) {
  calendar.addEvent(event);
}

/*** Event information view module functions ***/
function closeInfoModule() {
  let closeInfoModule = document.getElementById("closeEinfoModule");
  closeInfoModule.addEventListener("click", () => removeInfoModule());
}

function removeInfoModule() {
  let moduleBg = document.getElementById("moduleBg");
  moduleBg.classList.add("display-none");
  let infoBox = document.querySelector(".EinfoModule");
  moduleBg.removeChild(infoBox);
}

function deleteEventBtn(event) {
  let deleteBtn = document.getElementById("deleteEvent");
  deleteBtn.addEventListener("click", async () => {
    if (event.groupId === "null" || event.groupId === "") {
      deleteEvent(event.id, "events");
    } else {
      let courseData = await fetchCourses();
      let clickedEvent = Object.values(courseData).filter(
        (cEvent) => `${cEvent.groupId}` === event.groupId
      );
      clickedEvent.forEach((e) => {
        deleteEvent(e._id, "courses");
      });

      let eventData = await fetchEvents();
      let exEvent = Object.values(eventData).filter(
        (e) => `${e.groupId}` === event.groupId
      );
      if (exEvent !== undefined) deleteEvent(exEvent[0]._id, "events");
    }
    removeInfoModule();
  });
}

async function deleteEvent(id, type) {
  calendar.getEventById(id).remove();
  await DELETEData(id, type);
  document.getElementById("moduleBg").classList.add("display-none");
}

function updateEventForm({
  id,
  title,
  start,
  backgroundColor,
  extendedProps: { description },
}) {
  // display event form box
  document.getElementById("moduleBg").classList.remove("display-none");
  document.getElementById("eventModule").classList.remove("display-none");

  // fetch data into form
  let time = start.toLocaleTimeString(undefined, {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  let dateArray = start.toLocaleDateString("fa-IR").split("/");
  document.querySelector("#eventModule h1").innerHTML = "تغییر رویداد";
  document.querySelector("#eventForm #eventTitle").value = title;
  document.querySelector("#eventForm #eventDate").value = `${
    dateArray[0]
  }/${dateArray[1].padStart(2, "۰")}/${dateArray[2].padStart(2, "۰")}`;
  document.querySelector("#eventForm #eventTime").value = `${time}`;

  document.querySelector("#eventForm #eventColor").value = backgroundColor;

  if (description !== null)
    document.querySelector("#eventForm #eventDescription").value = description;

  document.querySelector('#eventForm input[type="submit"]').value =
    "ثبت تغییرات";

  eventForm.addEventListener("submit", (e) => {
    e.preventDefault();
    deleteEvent(id);
  });
}

// store each event id
let eventIds;
function updateClassForm(events, exam) {
  eventIds = [];
  // display event form box
  document.getElementById("moduleBg").classList.remove("display-none");
  document.getElementById("classModule").classList.remove("display-none");

  document.querySelector("#classModule h1").innerHTML = "تغییر برنامه درسی";
  // fetch data into form
  events.forEach((event) => {
    eventIds.push(event._id);
    let IGclone = addScheduleBox();
    let classTime = event.rrule.dtstart.split("T")[1];
    let classDate = event.rrule.dtstart.split("T")[0].split("-");
    classDate = jalaali.toJalaali(
      parseInt(classDate[0]),
      parseInt(classDate[1]),
      parseInt(classDate[2])
    );
    document.querySelector("#classTitle").value = event.title;
    IGclone.querySelector("#classSDate").value = `${classDate.jy}/${String(
      classDate.jm
    ).padStart(2, "۰")}/${String(classDate.jd).padStart(2, "۰")}`;
    IGclone.querySelector("#classTime").value = classTime;
    IGclone.querySelector("#repeatInput").value =
      event.rrule.interval === 1 ? "everyWeek" : "evenWeeks";

    let endDate = event.rrule.until.split("-");
    endDate = jalaali.toJalaali(
      parseInt(endDate[0]),
      parseInt(endDate[1]),
      parseInt(endDate[2])
    );

    document.querySelector("#classEndDate").value = `${endDate.jy}/${String(
      endDate.jm
    ).padStart(2, "۰")}/${String(endDate.jd).padStart(2, "۰")}`;
  });

  if (exam !== undefined) {
    eventIds.push(exam._id);
    let exTime = exam.start.split("T")[1];
    let exDate = exam.start.split("T")[0].split("-");
    exDate = jalaali.toJalaali(
      parseInt(exDate[0]),
      parseInt(exDate[1]),
      parseInt(exDate[2])
    );
    document.querySelector("#exDate").value = `${exDate.jy}/${String(
      exDate.jm
    ).padStart(2, "۰")}/${String(exDate.jd).padStart(2, "۰")}`;
    document.querySelector("#exTime").value = exTime;
  }
  document.querySelector("#classForm #eventColor").value = exam.color;
  document.querySelector('#classForm input[type="submit"]').value =
    "ثبت تغییرات";
}

function AddUpdatedEvent() {
  classForm.addEventListener("submit", (e) => {
    e.preventDefault();

    eventIds.forEach((id, index) => {
      deleteEvent(id, "courses");
      if (index == eventIds.length - 1) deleteEvent(id, "events");
    });
    removeInputGroup();
  });
}

/*** Fetching all events and courses functions ***/
async function fetchEvents() {
  return fetch("/events")
    .then((rest) => rest.json())
    .then((data) => {
      return data;
    });
}

async function fetchCourses() {
  return fetch("/courses")
    .then((rest) => rest.json())
    .then((data) => {
      return data;
    });
}

async function POSTData(event, type) {
  try {
    const response = await fetch(`/${type}`, {
      method: "POST",
      body: JSON.stringify(event),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      return fetch("/events")
        .then((rest) => rest.json())
        .then((data) => {
          let popedID = data.pop()._id;
          return { ...event, id: popedID };
        });
    }
  } catch (error) {
    alert("error in event submit");
  }
}

async function DELETEData(id, type) {
  try {
    const response = await fetch(`/${type}`, {
      method: "DELETE",
      body: JSON.stringify({ id: id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("error in event submit");
  }
}

// async function dldatabase() {
//   try {
//     const response = await fetch("/courses", {
//       method: "DELETE",
//       body: JSON.stringify({
//         id: "65b2e8b672ec17b68d47a7d4",
//       }),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   } catch (error) {
//     alert("error in event delete");
//   }
// }

// dldatabase();
