const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    location: {
        type: String,
        required: true
    },

    propertyType: {
        type: String,
        enum: ["apartment", "duplex", "bungalow", "land", "commercial"],
        required: true,
    },

    bedrooms: {
        type: Number,
        default: 0,
    },

    // bathrooms: {
    //     type: Number,
    //     default: 0,
    // },

    image: {
        type: String,
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agents",
        required: true,
    },
    availableSlots: [
        {
            date: String,
            times: [String], // e.g. ["10:00", "12:00"]
        },
    ],
}, { timestamps: true });

const propertyModel = mongoose.model("Property", PropertySchema);
module.exports = propertyModel