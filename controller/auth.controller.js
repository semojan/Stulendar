const express = require("express");

const router = express.Router();

const sessionUtil = require("../util/session-util");
const User = require("../model/user.model");

router.get("/signup", function(req, res, next){
    let sessionData = sessionUtil.getSessionData(req);

    if (!sessionData){
        sessionData = {
            username: "",
            password: "",
            email: ""
        }
    }

    res.render("signup", inputData = sessionData);
});

router.post("/signup", async function(req, res, next){
    const userData = req.body;
    const user = new User(
        userData.username,
        userData.password,
        userData.email
    );

    await user.addUser();

    const createdUser = await user.getUser();

    sessionUtil.createUserSession(req, createdUser, function(){
        res.redirect("/");
    });
});

router.get("/login", function(req, res, next){
    let sessionData = sessionUtil.getSessionData(req);

    if (!sessionData){
        sessionData = {
            username: "",
            password: "",
            email: ""
        }
    }

    res.render("login", inputData = sessionData);
});

router.post("/login", async function(req, res, next){
    const userData = req.body;
    const user = new User(
        userData.username,
        userData.password
    );

    const existingUser = await user.getUser();
    
    if(!existingUser){
        res.redirect("/login");
        return;
    }

    const correctPass = await user.comparePass(existingUser.password)

    if(!correctPass){
        res.redirect("/login");
        return;
    }

    sessionUtil.createUserSession(req, existingUser, function(){
        res.redirect("/");
    });
});

module.exports = router;