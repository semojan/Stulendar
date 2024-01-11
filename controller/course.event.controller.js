const express = require("express");
const Event = require("../model/event.model");
const Course = require("../model/course.model");

const router = express.Router();

router.get("/events", async function (req , res){
    events = await Event.getEvents("1");

    res.json(events);
});

router.post("/events", async function(req, res, next){

    const eventData = req.body;
    try {
        const event = new Event(
            "1",
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

router.patch("/events", async function(req, res, next){
    const eventData = req.body;
    try {
        const event = new Event(
            "1",
            eventData.groupId,
            eventData.color,
            eventData.title,
            eventData.start,
            eventData.description,
            eventData._id
        );
        await event.saveEvent();

        res.status(201).json({
            message: "event was successfully updated"
        });
    } catch (error){
        next(error);
        return;
    }
});

router.delete("/events", async function(req, res, next){
    const eventId = req.body.id;
    try {
        await Event.removeEvent(eventId);

        res.status(201).json({
            message: "event was successfully deleted"
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