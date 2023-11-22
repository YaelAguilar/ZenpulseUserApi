require('dotenv').config()
require("./database/database").connect()
const User = require('./model/user')
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const auth = require('./middleware/auth')

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())

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
        if (existingUser){
            return res.status(401).send('User already exists with tihs email')
        }

        //encrypt the password
        const myEncpassword = await bcrypt.hash(password, 10)
        //save the user in DB
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: myEncpassword
        })
        //generate a token for user and send it
        const token = jwt.sign(
            {id: user._id, email},
            'shhhh', //process.env.jwtsecret
            {
                expiresIn: "1h"
            }
        );
        user.token = token
        user.password = undefined


        res.status(201).json(user)



    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
})

app.post('/login', async (req, res) => {
    try {
        // Obtener todos los datos del frontend
        const { email, password } = req.body;
        
        // Validación
        if (!(email && password)) {
            return res.status(400).send('Envía todos los datos necesarios');
        }
        
        // Buscar al usuario en la base de datos
        const user = await User.findOne({ email });
        
        // Verificar si el usuario no existe
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Credenciales inválidas');
        }

        const token = jwt.sign(
            { id: user._id },
            'shhhh', // Deberías usar process.env.jwtsecret en producción
            {
                expiresIn: '1h'
            }
        );
        
        user.token = token;
        user.password = undefined;

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        return res.status(200).cookie('token', token, options).json({
            success: true,
            token,
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Error interno del servidor');
    }
});

app.get("/dashboard",auth, (req, res) => {

    console.log(req.user);
    res.send('Welcome to dashboard');
});
module.exports = app