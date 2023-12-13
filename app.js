const express = require("express");
const path = require("path");

const app = express();

const db = require("./data/mopngoDB");

app.use(express.static("public"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

db.connect().then( function(){
    app.listen(3500);
}).catch( function(error) {
    console.log("Failed to connect to the database!");
    console.log(error);
});