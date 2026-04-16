const mongoose = require("mongoose")

const dotenv = require("dotenv")
dotenv.config()

const mongoDbKey = process.env.mongodbUri
const connectDatabase = async () => {
    console.log("Connecting to Database...");
    try {
        const connect = await mongoose.connect(mongoDbKey)
        if (connect) {
            console.log("MongoDb Connected Successfully👩🏾‍💻✅❤️");

        }
    } catch (error) {
        console.log(error);

    }


}

module.exports = connectDatabase