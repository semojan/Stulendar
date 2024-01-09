const express = require("express");
const path = require("path");

const eSession = require("express-session")

const db = require("./data/mongoDB");
const authController = require("./controller/auth.controller");
const appController = require("./controller/app.controller");
const sessionConfig = require("./config/session");

const app = express();

app.use(express.static("public"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const session = sessionConfig();

app.use(eSession(session));

// path controllers
app.use(authController);
app.use(appController);


// error handlers
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
db.connectToDB().then( function(){
    app.listen(3500);
}).catch( function(error) {
    console.log("Failed to connect to the database!");
    console.log(error);
});