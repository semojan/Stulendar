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
  console.log(eventDatas);
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
      console.log(info.event);
      let moduleBg = document.getElementById("moduleBg");

      moduleBg.appendChild(infoBoxClone);
      moduleBg.classList.remove("display-none");

      closeInfoModule();
      deleteEventBtn(info.event);

      //edit button
      let editBtn = document.getElementById("editEvent");
      editBtn.addEventListener("click", async () => {
        removeInfoModule();

        if (info.event.groupId === "null") {
          updateEventForm(info.event);
        } else {
          let clickedEvent = Object.values(events).filter(
            (event) => `${event.groupId}` === info.event.groupId
          );
          let exEvent = clickedEvent.pop();
          Promise.resolve(updateClassForm(clickedEvent, exEvent)).then(() =>
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
    parseInt(dateArray[0]),
    parseInt(dateArray[1]),
    parseInt(dateArray[2])
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
  };

  try {
    const response = await fetch("/events", {
      method: "POST",
      body: JSON.stringify(newEvent),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      fetch("/events")
        .then((rest) => rest.json())
        .then((data) => {
          console.log(data);
          let popedID = data.pop()._id;
          newEvent = { ...newEvent, id: popedID };
        });
    }
  } catch (error) {
    alert("error in event submit");
  }

  addEvent(newEvent);
  closeModule();
  form.reset();
}

const classForm = document.getElementById("classForm");
classForm.addEventListener("submit", (e) => {
  e.preventDefault();
  classFormSubmit(classForm);
});

function classFormSubmit(form) {
  let classEvent = Object.fromEntries(new FormData(form));
  let dateArray = classEvent.exDate.split("/");
  let exDate = jalaali.toGregorian(
    parseInt(dateArray[0]),
    parseInt(dateArray[1]),
    parseInt(dateArray[2])
  );
  exDate =
    `${exDate.gy}-${String(exDate.gm).padStart(2, "0")}-${String(
      exDate.gd
    ).padStart(2, "0")}` +
    "T" +
    classEvent.exTime;

  let scheduleForm = document.querySelectorAll("#timeScheduleBox #IG");
  let groupId = calendar.getEvents().length;
  let id = groupId;
  Object.values(scheduleForm).forEach((Sform) => {
    let inputGroup = Object.fromEntries(new FormData(Sform));
    let weekday = new Date(inputGroup.classSDate);
    dateArray = inputGroup.classSDate.split("/");
    let startDate = jalaali.toGregorian(
      parseInt(dateArray[0]),
      parseInt(dateArray[1]),
      parseInt(dateArray[2])
    );
    startDate =
      `${startDate.gy}-${String(startDate.gm).padStart(2, "0")}-${String(
        startDate.gd
      ).padStart(2, "0")}` +
      "T" +
      inputGroup.classTime;

    let dateArray2 = classEvent.classEndDate.split("/");
    let endDate = jalaali.toGregorian(
      parseInt(dateArray2[0]),
      parseInt(dateArray2[1]),
      parseInt(dateArray2[2])
    );

    endDate = `${startDate.gy}-${String(startDate.gm).padStart(
      2,
      "0"
    )}-${String(startDate.gd).padStart(2, "0")}`;

    addEvent({
      groupId: groupId,
      id: id++,
      color: classEvent.eventColor,
      title: classEvent.classTitle,
      rrule: {
        freq: "weekly",
        interval: inputGroup.repeatInput == "everyWeek" ? 1 : 2,
        byweekday: [weekday.toString().slice(0, 2)],
        dtstart: startDate,
        until: endDate,
      },
    });
  });

  addEvent({
    groupId: groupId,
    id: id++,
    color: classEvent.eventColor,
    title: `امتحان ${classEvent.classTitle}`,
    start: exDate,
  });
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
  deleteBtn.addEventListener("click", () => {
    if (event.groupId === "") deleteEvent(event.id);
    else {
      let clickedEvent = Object.values(events).filter(
        (cEvent) => `${cEvent.groupId}` === event.groupId
      );
      clickedEvent.forEach((e) => {
        deleteEvent(e.id);
      });
    }
    removeInfoModule();
  });
}

function deleteEvent(id) {
  calendar.getEventById(id).remove();
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
  eventIds.push(exam.id);
  // display event form box
  document.getElementById("moduleBg").classList.remove("display-none");
  document.getElementById("classModule").classList.remove("display-none");

  document.querySelector("#classModule h1").innerHTML = "تغییر کلاس درس";
  // fetch data into form
  events.forEach((event) => {
    eventIds.push(event.id);
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
  document.querySelector("#classForm #eventColor").value = exam.color;
  document.querySelector('#classForm input[type="submit"]').value =
    "ثبت تغییرات";
}

function AddUpdatedEvent() {
  classForm.addEventListener("submit", (e) => {
    e.preventDefault();
    eventIds.forEach((id) => {
      deleteEvent(id);
    });
    removeInputGroup();
  });
}

// fetch("/courses")
//   .then((rest) => rest.json())
//   .then((data) => {
//     console.log(data);
//   });

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
