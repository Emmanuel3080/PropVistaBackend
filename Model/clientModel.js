
const mongoose = require("mongoose")

const clientSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    phoneNumber: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "Agent"],
        default: "user"
       
    }
}, { timestamps: true })


const clientModel = mongoose.model("clientsInformation", clientSchema)
module.exports = clientModel