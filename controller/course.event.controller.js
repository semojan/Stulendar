const express = require("express");
const Event = require("../model/event.model");
const Course = require("../model/course.model");

const router = express.Router();

router.get("/events", async function (req , res){
    events = await Event.getEvents();

    res.json(events);
});

router.post("/events", async function(req, res, next){

    const eventData = req.body;
    console.log(eventData);
    try {
        const event = new Event(
            eventData.groupId,
            eventData.color,
            eventData.title,
            eventData.start,
            eventData.description
        );
        await event.saveEvent();

        res.status(201).json({
            message: "event was successfully added"
        });
    } catch (error){
        next(error);
        return;
    }
});

router.get("/courses", async function (req, res){
    courses = await Course.getCourses();

    res.json(courses);
});

module.exports = router;