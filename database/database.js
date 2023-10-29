const mongoose = require("mongoose");

const MONGODB_URL = process.env.MONGODB_URL;

exports.connect = () => {
    console.log(typeof MONGODB_URL);
    mongoose.connect(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(
        console.log('DB connected')
    )
    .catch((error) => {
        console.log(`DB connection FAILED`);
        console.error(error);
        process.exit(1);
    });
};
