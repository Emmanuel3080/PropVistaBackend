const mongoose = require("mongoose")

const AgentSchema = new mongoose.Schema({
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

  phone: {
    type: String,
    required: true
  },

  agencyName: {
    type: String,
    required: true,
    unique: true
  },
  profileImage: {
    type: String,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ["user", "Agent"],
    default: "Agent"

  }

}, { timestamps: true });



const AgentModel = mongoose.model("Agents", AgentSchema)
module.exports = AgentModel      