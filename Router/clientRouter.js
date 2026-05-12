
const express = require("express")
const { Signup, SignIn, verifyToken, getClient, allUser, updateUser, logout } = require("../ClientAuth/Auth")
const isUserLoggedIn = require("../ClientMiddleware/isUserLoggedIn")
const { allProperties, singleProperty } = require("../Controller/PropertyController")
const { BookAppointment } = require("../Appointment/Appointment")

const clientRouter = express.Router()



// Auth Endpoints
clientRouter.post("/auth/signup", Signup)
clientRouter.post("/auth/signin", SignIn)
clientRouter.post("/auth/verify_token", verifyToken)
clientRouter.patch("/client/update/:userId", isUserLoggedIn, updateUser)
clientRouter.get("/client/:clientId", isUserLoggedIn, getClient)
clientRouter.get("/clients/all", isUserLoggedIn, allUser)
clientRouter.post("/logout", logout)



// Properties EndPoints
clientRouter.get("/property/all", isUserLoggedIn, allProperties)
clientRouter.get("/property/single/:propertyId", isUserLoggedIn, singleProperty)

   

// Appointments
clientRouter.post("/appointment_book", isUserLoggedIn, BookAppointment)
module.exports = clientRouter
