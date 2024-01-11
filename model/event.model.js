const db = require("../data/mongoDB");

const mongodb = require("mongodb")

class Event{
    constructor (userId, groupId, color, title, start, description, eventId){
        this.userId = userId;
        this.groupId = groupId;
        this.color = color;
        this.title = title;
        this.start = start;
        this.description = description;
        this.id = eventId;
    }

    async saveEvent(){
        const eventData = {
            userId: this.userId,
            groupId: this.groupId,
            color: this.color,
            title: this.title,
            start: this.start,
            description: this.description
        };

        if (this.id){ //update if already exists
            const eventId = new mongodb.ObjectId(this.id);

            await db.getDb().collection('events').updateOne({_id: eventId}, {
                $set: {
                    ...eventData
                }
            });
        } else { // save if it's new
            await db.getDb().collection("events").insertOne(eventData);
        }
    } 

    static async getEvents(uid){
        return await db.getDb().collection("events").find({userId: uid}).toArray();
    }

    static async removeEvent(id){
        const eventId = new mongodb.ObjectId(id);
        await db.getDb().collection("events").deleteOne({_id: eventId});
    }
}

module.exports = Event;
