
const express = require("express")
const { Signup } = require("../ClientAuth/Auth")

const clientRouter = express.Router()


clientRouter.post("/auth/signup", Signup)


module.exports = clientRouter
