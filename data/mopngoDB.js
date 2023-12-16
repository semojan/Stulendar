const mongodb = require("mongodb");

const client = mongodb.MongoClient;

let database

//using mongo clinet to stablish a connection
async function connect (){
    const connection = await client.connect("mongodb://127.0.0.1:27017");
    database = connection.db("stulendar"); //connecting to server
}

function getDb (){
    if (!database){
        throw new Error("no connection to a database!");
    }

    return database;
}

module.exports = {
    connect : connect,
    getDb : getDb
}