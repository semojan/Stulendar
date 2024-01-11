const db = require("../data/mongoDB");

const mongodb = require("mongodb")

class Course{
    constructor (userId, groupId, title, color, rrule, courseId){
        this.userId = userId;
        this.groupId = groupId;
        this.title = title;
        this.color = color;
        this.rrule = rrule;
        this.id = courseId;
    }

    async saveCourse(){
        const courseData = {
            userId: this.userId,
            groupId: this.groupId,
            title: this.title,
            color: this.color,
            rrule: this.rrule
        };

        if (this.id){ //update if already exists
            const courseId = new mongodb.ObjectId(this.id);

            await db.getDb().collection('courses').updateOne({_id: courseId}, {
                $set: {
                    ...courseData
                }
            });
        } else { // save if it's new
            await db.getDb().collection("courses").insertOne(courseData);
        }
    } 

    static async getCourses(uid){
        return await db.getDb().collection("courses").find({userId: uid}).toArray();
    }

    static async removeCourse(id){
        const courseId = new mongodb.ObjectId(id);
        await db.getDb().collection("courses").deleteOne({_id: courseId});
    }
}

module.exports = Course;
