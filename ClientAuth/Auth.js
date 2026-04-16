const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const clientModel = require("../Model/clientModel")
const Signup = async (req, res, next) => {
    const { fullName, password, email } = req.body

    if (!fullName || !password || !email) {
        return res.status(400).json({
            Message: "Missing or Incorrect fields",
            Status: "Error"
        })
    }
    try {  
        // Hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const client = await clientModel.create({ ...req.body, password: hashedPassword })

        if (!client) {
            return res.status(400).json({
                Status: "Error",
                Message: "Unable to create user account. Please try again."
            });
        }

        const userDetails = {
            fullName: client?.fullName,
            id: client?._id,
            email: client?.email,
        }
        return res.status(201).json({
            Status: "Success",
            Message: "User account created successfully.",
            data: userDetails
        });

    } catch (error) {
        console.log(error);
        next(error)
    }
}


const SignIn = async (req, res, next) => {
    const { userEmail } = req.body
    try {

    } catch (error) {

    }
}   
module.exports = {
    Signup
}