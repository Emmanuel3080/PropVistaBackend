const mongoose = require("mongoose")

const appointmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "clientsInformation",
            required: true
        },

        propertyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property",
            required: true
        },

        agentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Agents",
            required: true
        },

        // appointmentType: {
        //     type: String,
        //     enum: ["physical", "virtual", "call"],
        //     required: true
        // },

        date: {
            type: String,
            required: true
        },

        time: {
            type: String,
            required: true
        },

        message: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled", "completed"],
            default: "pending"
        }
    },
    { timestamps: true }
);

const AppointmentModel = mongoose.model("Appointment", appointmentSchema)
module.exports = AppointmentModel