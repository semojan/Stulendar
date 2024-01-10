const db = require("../data/mongoDB");
const bcrypt = require("bcryptjs");

class User{
    constructor (username, password, email){
        this.username = username;
        this.password = password;
        this.email = email;
    }

    async signUp(){
        const hashedPass = await bcrypt.hash(this.password, 12);

        await db.getDb().collection("users").insertOne({
            username: this.username,
            password: hashedPass,
            email: this.email
        });
    }

    async getUser(){
        return await db.getDb().collection("users").findOne({username:this.username});
    }

    async comparePass(hashedPass){
        return await bcrypt.compare(this.password, hashedPass);
    }

    async existsAlready(){
        const existingUser = await this.getUser();

        if(existingUser){
            return true;
        }

        return false;
    }
}

module.exports = User;