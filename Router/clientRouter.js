
const express = require("express")
const { Signup, SignIn, verifyToken, getClient, allUser, updateUser } = require("../ClientAuth/Auth")

const clientRouter = express.Router()


clientRouter.post("/auth/signup", Signup)
clientRouter.post("/auth/signin", SignIn)

clientRouter.post("/auth/verify_token", verifyToken)

clientRouter.patch("/client/update/:userId", updateUser)
clientRouter.get("/client/:clientId", getClient)
clientRouter.get("/clients/all", allUser)

module.exports = clientRouter
