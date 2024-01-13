const express = require("express");

const router = express.Router();

router.get("/", function (req , res){
    if(!req.session.uid){
        res.redirect("/login");
    }
    res.render("index");
});

module.exports = router;