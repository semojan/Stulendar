let events = [
    {
      groupId: 1,
      id: 1,
      title: "my recurring event",
      color: "#919",
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
      title: "my recurring event22",
      color: "#910",
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
      color: "#910",
      title: "Ex of my recurring event",
      start: "2024-02-29T08:00:00",
      description: "nothing special",
    },
  ],
  calendar;

document.addEventListener("DOMContentLoaded", initCalendar());

function initCalendar() {
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
      deleteEventBtn(info.event.id);

      //edit button
      let editBtn = document.getElementById("editEvent");
      editBtn.addEventListener("click", () => {
        // remove info box from html
        document
          .getElementById("moduleBg")
          .removeChild(document.querySelector(".EinfoModule"));
        if (info.event.groupId === "") updateEventForm(info.event);
        else {
          let clickedEvent = Object.values(events).filter(
            (event) => `${event.groupId}` === info.event.groupId
          );
          let exEvent = clickedEvent.pop();
          updateClassForm(clickedEvent, exEvent);
        }
      });
    },

    events: events,
  });

  calendar.setOption("aspectRatio", ratio + 0.05);
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

function eventSubmit(form) {
  let event = Object.fromEntries(new FormData(form));
  event.start = event.start + "T" + event.eventTime + ":00";
  closeModule();
  addEvent({
    id: calendar.getEvents().length,
    title: event.title,
    start: event.start,
  });
  form.reset();
}

const classForm = document.getElementById("classForm");
classForm.addEventListener("submit", (e) => {
  e.preventDefault();
  classFormSubmit(classForm);
});

function classFormSubmit(form) {
  let classEvent = Object.fromEntries(new FormData(form));
  classEvent.exDate = classEvent.exDate + "T" + classEvent.exTime + ":00";

  let scheduleForm = document.querySelectorAll("#timeScheduleBox #IG");
  let groupId = calendar.getEvents().length;
  let id = groupId;
  Object.values(scheduleForm).forEach((Sform) => {
    let inputGroup = Object.fromEntries(new FormData(Sform));
    let weekday = new Date(inputGroup.classSDate);
    inputGroup.classSDate =
      inputGroup.classSDate + "T" + inputGroup.classTime + ":00";

    let result = {
      groupId: groupId,
      id: id++,
      title: classEvent.classTitle,
      rrule: {
        freq: "weekly",
        interval: inputGroup.repeatInput == "everyWeek" ? 1 : 2,
        byweekday: [weekday.toString().slice(0, 2)],
        dtstart: inputGroup.classSDate,
        until: classEvent.classEndDate,
      },
    };
    console.log(result);
    addEvent({
      groupId: groupId,
      id: id++,
      title: classEvent.classTitle,
      rrule: {
        freq: "weekly",
        interval: inputGroup.repeatInput == "everyWeek" ? 1 : 2,
        byweekday: [weekday.toString().slice(0, 2)],
        dtstart: inputGroup.classSDate,
        until: classEvent.classEndDate,
      },
    });
  });

  addEvent({
    groupId: groupId,
    id: id++,
    title: `امتحان ${classEvent.classTitle}`,
    start: classEvent.exDate,
  });
  closeModule();
  form.reset();
}

/*** Add event to calendar ***/
function addEvent(event) {
  calendar.addEvent(event);
}

/*** Event information view module functions ***/
function closeInfoModule() {
  let closeInfoModule = document.getElementById("closeEinfoModule");
  closeInfoModule.addEventListener("click", () => {
    let moduleBg = document.getElementById("moduleBg");
    moduleBg.classList.add("display-none");
    let infoBox = document.querySelector(".EinfoModule");
    moduleBg.removeChild(infoBox);
  });
}

function deleteEventBtn(eventId) {
  let deleteBtn = document.getElementById("deleteEvent");
  deleteBtn.addEventListener("click", () => {
    deleteEvent(eventId);
  });
}

function deleteEvent(id) {
  calendar.getEventById(id).remove();
  document.getElementById("moduleBg").classList.add("display-none");
}

function updateEventForm({ id, title, start, description }) {
  // display event form box
  document.getElementById("eventModule").classList.remove("display-none");

  // fetch data into form
  let time = start.toLocaleTimeString().slice(0, 7);
  let dateArray = start.toLocaleDateString().split("/");
  document.querySelector("#eventModule h1").innerHTML = "تغییر رویداد";
  document.querySelector("#eventForm #eventTitle").value = title;
  document.querySelector("#eventForm #eventDate").value = `${
    dateArray[2]
  }-${dateArray[0].padStart(2, "0")}-${dateArray[1].padStart(2, "0")}`;
  document.querySelector("#eventForm #eventTime").value = `0${time}`;

  if (description !== undefined)
    document.querySelector("#eventForm #eventDescription").value = description;

  document.querySelector('#eventForm input[type="submit"]').value =
    "ثبت تغییرات";

  eventForm.addEventListener("submit", (e) => {
    e.preventDefault();
    deleteEvent(id);
    eventSubmit(eventForm);
  });
}

async function updateClassForm(events, exam) {
  // store each event id
  let eventIds = [exam.id];

  // display event form box
  document.getElementById("classModule").classList.remove("display-none");

  // fetch data into form
  await events.forEach((event) => {
    eventIds.push(event.id);
    let IGclone = addScheduleBox();
    let classTime = event.rrule.dtstart.split("T")[1];
    let classDate = event.rrule.dtstart.split("T")[0];
    let exTime = exam.start.split("T")[1];
    let exDate = exam.start.split("T")[0];
    document.querySelector("#classModule h1").innerHTML = "تغییر کلاس درس";
    document.querySelector("#classTitle").value = event.title;
    IGclone.querySelector("#classSDate").value = classDate;
    IGclone.querySelector("#classTime").value = classTime;
    IGclone.querySelector("#repeatInput").value =
      event.rrule.interval === 1 ? "everyWeek" : "evenWeeks";

    document.querySelector("#classEndDate").value = event.rrule.until;
    document.querySelector("#exDate").value = exDate;
    document.querySelector("#exTime").value = exTime;
  });
  document.querySelector('#classForm input[type="submit"]').value =
    "ثبت تغییرات";

  let form = document.getElementById("classForm");
  console.log(Object.fromEntries(new FormData(form)));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    eventIds.forEach((id) => {
      deleteEvent(id);
    });
    classFormSubmit(form);
  });
}
