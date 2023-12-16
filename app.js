const express = require("express");
const path = require("path");

const app = express();

const db = require("./data/mopngoDB");
const controller = require("./controller/app.controller");

app.use(express.static("public"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(controller);

//makes sure to connect to db before running the app on port 3500
db.connect().then( function(){
    app.listen(3500);
}).catch( function(error) {
    console.log("Failed to connect to the database!");
    console.log(error);
});