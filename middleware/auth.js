const jwt = require('jsonwebtoken')

const auth = (req, res) =>{
    //grab token from cookie
    console.log(req.cookies);
    const {token} = req.cookies
    //if no token, stop there
    if (!token) {
        res.status(403).send('Please login first')
    }

    //decode that token and get id
    const decode = jwt.verify(token, 'shhhh')
    console.log(decode)
    //query to DB for that user id
}

module.exports = auth