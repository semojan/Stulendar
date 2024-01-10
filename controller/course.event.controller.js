const express = require("express");
const Event = require("../model/event.model");
const Course = require("../model/course.model");

const router = express.Router();

router.get("/getevents", async function (req , res){
    events = await Event.getEvents();
    courses = await Course.getCourses();

    res.json({eventsData: events, coursesData: courses});
});

module.exports = router;