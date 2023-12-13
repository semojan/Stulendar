const mongodb = require("mongodb");

const client = mongodb.MongoClient;

let database

async function connect (){
    const connection = await client.connect("mongodb://127.0.0.1:27017");
    database = connection.db("stulendar");
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