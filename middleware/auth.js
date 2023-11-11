const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    // Obtener el token de las cookies
    const { token } = req.cookies;

    // Si no hay token, detener la ejecución
    if (!token) {
        return res.status(403).send('Please login first');
    }

    // Decodificar el token y obtener el ID del usuario
    try {
        const decoded = jwt.verify(token, 'shhhh');
        req.user = decoded;
        return next();
    } catch (error) {
        console.error(error);

        // Manejar errores específicos, por ejemplo, token expirado
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send('Token expired');
        }

        return res.status(401).send('Invalid Token');
    }
};

module.exports = auth;