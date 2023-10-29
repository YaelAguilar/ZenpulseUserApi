require('dotenv').config()
require("./database/database").connect()
const User = require('./model/user')
const express = require('express')

const app = express()
app.use(express.json())

app.get("/", (req, res) => {
    res.send("<h1>Server is working</h1>")
})

app.post("/register", async (req, res) => {
    try {
        //get all data from body
        const {firstname, lastname, email, password} = req.body 
        //all the data should exists
        if (!(firstname && lastname && email && password)){
            res.status(400).send('All fields are compulsory')
        }
        //check if user already exists - email
        const existingUser = await User.findOne({ email })
        //encrypt the password
        //save the user in DB
        //generate a token for user and send it


    } catch (error) {
        console.log(error);
    }
})


module.exports = app