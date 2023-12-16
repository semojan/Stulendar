const session = require("express-session");
const MongoSessionStore = require("connect-mongodb-session");

//create a store for session in mongodb db
function createStore (){
    const mongoSessionStore = new MongoSessionStore(session);

    const store = mongoSessionStore({
        uri: "mongodb://localhost:27017",
        databaseName: "blog",
        collection: "sessions"
    });

    return store;
}

//create session config
function createConfig (){
    return {
        secret: "secret",
        resave: false,
        saveUninitialized: false,
        store: createStore(),
        cookie: {
            maxAge: 10 * 60 * 1000
        }
    }
}

module.exports = createConfig;