const db = require("../data/mongoDB");

class Course{
    constructor (groupId, title, color, rrule, courseId){
        this.groupId = groupId;
        this.title = title;
        this.color = color;
        this.rrule = rrule;
        this.id = courseId;
    }

    async saveCourse(){
        const courseData = {
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

    static async getCourses(){
        return await db.getDb().collection("courses").find().toArray();
    }

    async removeCourse(){
        const evcourseIdentId = new mongodb.ObjectId(this.id);
        await db.getDb().collection("courses").deleteOne({_id: courseId});
    }
}

module.exports = Course;
