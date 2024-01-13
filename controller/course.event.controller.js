const express = require("express");
const Event = require("../model/event.model");
const Course = require("../model/course.model");

const router = express.Router();

router.get("/events", async function (req , res){
    const events = await Event.getEvents("1");

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

router.get("/courses", async function (req , res){
    const courses = await Course.getCourses("1");

    res.json(courses);
});

router.post("/courses", async function(req, res, next){

    const courseData = req.body;
    try { 
        const course = new Course(
            "1",
            courseData.groupId,
            courseData.title,
            courseData.color,
            courseData.rrule.freq,
            courseData.rrule.interval,
            courseData.rrule.byweekday,
            courseData.rrule.dtstart,
            courseData.rrule.until
        );
        await course.saveCourse();

        res.status(201).json({
            message: "course was successfully added"
        });
    } catch (error){
        next(error);
        return;
    }
});

router.patch("/courses", async function(req, res, next){
    const courseData = req.body;
    try {
        const course = new Course(
            "1",
            courseData.groupId,
            courseData.title,
            courseData.color,
            courseData.rrule.freq,
            courseData.rrule.interval,
            courseData.rrule.byweekday,
            courseData.rrule.dtstart,
            courseData.rrule.until,
            courseData.id
        );
        await course.saveCourse();

        res.status(201).json({
            message: "course was successfully updated"
        });
    } catch (error){
        next(error);
        return;
    }
});

router.delete("/courses", async function(req, res, next){
    const courseId = req.body.id;
    try {
        await Course.removeCourse(courseId);

        res.status(201).json({
            message: "course was successfully deleted"
        });
    } catch (error){
        next(error);
        return;
    }
});

module.exports = router;