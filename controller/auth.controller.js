const express = require("express");

const router = express.Router();

const sessionFlash = require("../util/session-flash");
const User = require("../model/user.model");

router.get("/signup", function(req, res, next){
    let sessionData = sessionFlash.getSessionData(req);

    if (!sessionData){
        sessionData = {
            username: "",
            password: "",
            email: ""
        }
    }

    res.render("", inputData = sessionData);
});

// router.post("signup", function(req, res, next){

// });

module.exports = router;