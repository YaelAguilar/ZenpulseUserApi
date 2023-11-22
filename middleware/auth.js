const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
        const decoded = jwt.verify(token, 'shhhh');  // Reemplaza esto con process.env.jwtsecret en producción
        req.user = decoded;
        next();
      } catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Unauthorized' });
      }
};

module.exports = auth;