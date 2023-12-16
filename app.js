const express = require("express");
const path = require("path");

const eSession = require("express-session")

const db = require("./data/mopngoDB");
const controller = require("./controller/app.controller");
const sessionConfig = require("./config/session");

const app = express();

app.use(express.static("public"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const session = sessionConfig();

app.use(eSession(session));

app.use(controller);

app.use(function(req, res){
    res.status(404).render("");
});

app.use(function(error, req, res, next){
    console.log(error);

    if(error.code === 404){
        return res.status(404).render("");
    }

    res.status(500).render("");
});

//makes sure to connect to db before running the app on port 3500
db.connect().then( function(){
    app.listen(3500);
}).catch( function(error) {
    console.log("Failed to connect to the database!");
    console.log(error);
});