const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    //this will be an assignment
    token: {
        type: String,
        default: null 
    },
})

module.exports = mongoose.model("user", userSchema)