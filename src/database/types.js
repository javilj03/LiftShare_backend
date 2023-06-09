let mongoose = require('mongoose')
const { Schema } = mongoose;

const userSchema = new Schema({
    name: String,
    lastName: String,
    email: String,
    username: String,
    password: String,
    weight: Number,
    height: Number,
    birth_date: Date,
    visibility: Boolean,
    image: String,
    posts: [
        { type: mongoose.Types.ObjectId, ref: 'Post' }
    ],
    routines: [
        { type: mongoose.Types.ObjectId, ref: 'Routine' }
    ],
    friends: [
        { type: mongoose.Types.ObjectId, ref: 'User' }
    ],
    friend_request: [
        { type: mongoose.Types.ObjectId, ref: 'User' }
    ]

});
let User = mongoose.model('Users', userSchema); //creating a Model

const routineSchema = new Schema({
    name: String,
    desc: String,
    days_of_week: [
        { type: mongoose.Types.ObjectId, ref: 'Day_routine' }
    ],
    visibility: Boolean
})
let Routine = mongoose.model('Routine', routineSchema)

const DayroutineSchema = new Schema({
    day_of_week: String,
    exercises: [
        { name: String, series: Number, reps: Number },
    ]
})
let DayRoutine = mongoose.model('Day_routine', DayroutineSchema)

const PostSchema = new Schema({
    title: String,
    image: String,
    date: Date,
    owner: { id: String, username: String }
});

let Post = mongoose.model('Post', PostSchema)

module.exports = { User, Routine, DayRoutine, Post } //Exporting the created module.