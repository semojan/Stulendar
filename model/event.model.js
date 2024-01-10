const db = require("../data/mongoDB");

class Event{
    constructor (groupId, color, title, start, description, eventId){
        this.groupId = groupId;
        this.color = color;
        this.title = title;
        this.start = start;
        this.description = description;
        this.id = eventId;
    }

    async saveEvent(){
        eventData = {
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

    static async getEvents(){
        return await db.getDb().collection("events").find().toArray();
    }

    async removeEvent(){
        const eventId = new mongodb.ObjectId(this.id);
        await db.getDb().collection("events").deleteOne({_id: eventId});
    }
}

module.exports = Event;
