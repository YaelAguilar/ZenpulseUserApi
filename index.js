const app = require('./app')
//const {PORT} = process.env
app.listen(3000, () => {
    console.log(`SERVER is running at port: ${3000}`);
})