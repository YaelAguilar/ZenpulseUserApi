// app.js
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');
const User = require('./model/user');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:3000' }));

app.get("/", (req, res) => {
    res.send("<h1>Server is working</h1>");
});

app.post("/register", async (req, res) => {
    try {
        // Obtener todos los datos del cuerpo
        const { firstname, lastname, email, password } = req.body;

        // Validar que todos los campos sean obligatorios
        if (!(firstname && lastname && email && password)) {
            return res.status(400).send('Todos los campos son obligatorios');
        }

        // Verificar si el usuario ya existe - email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({ error: 'Ya existe un usuario con este correo electrónico' });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Guardar el usuario en la base de datos
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword
        });

        // Generar un token para el usuario y enviarlo
        const token = jwt.sign(
            { id: user._id, email },
            process.env.JWT_SECRET || 'defaultSecret',
            {
                expiresIn: process.env.COOKIE_EXPIRATION || '1h'
            }
        );
        user.token = token;
        user.password = undefined;

        res.status(201).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send(`Error interno del servidor: ${error.message}`);
    }
});

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

        // Verificar si el usuario no existe o las credenciales son inválidas
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Credenciales inválidas');
        }

        // Generar un token y configurar las cookies
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'defaultSecret',
            {
                expiresIn: process.env.COOKIE_EXPIRATION || '1h'
            }
        );

        user.token = token;
        user.password = undefined;

        const options = {
            expires: new Date(Date.now() + (process.env.COOKIE_EXPIRATION || 24 * 60 * 60 * 1000)),
            httpOnly: true
        };

        res.cookie('token', token, options);
        res.status(200).json({
            success: true,
            token,
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
});

app.get("/dashbo", auth, (req, res) => {
    console.log(req.user);
    res.send('Welcome to dashboard');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;
