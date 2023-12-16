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
        secret: "",
        resave: false,
        saveUninitialized: false,
        store: createStore(),
        cookie: {
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "lax"
        }
    }
}

module.exports = createConfig;