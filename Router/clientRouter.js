
const express = require("express")
const { Signup, SignIn } = require("../ClientAuth/Auth")

const clientRouter = express.Router()


clientRouter.post("/auth/signup", Signup)
clientRouter.post("/auth/signin", SignIn)

module.exports = clientRouter
