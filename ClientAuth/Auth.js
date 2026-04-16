const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const clientModel = require("../Model/clientModel")
const dotenv = require("dotenv")
dotenv.config()
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
    const { userEmail, password } = req.body
    try {
        const client = await clientModel.findOne({ email: userEmail }).select("+password")

        if (!client) {
            return res.status(400).json({
                Message: "Email incorrect",
                Status: "Error"
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, client.password)

        if (!isPasswordMatch) {
            return res.status(400).json({
                Message: "Email or password incorrect",
                Status: "Error"
            })
        }

        const generateToken = await jwt.sign({ userId: client._id, email: client.email }, process.env.jwtUserToken, {
            expiresIn: process.env.jwtUserExpiry
        })


        return res.status(200).json({
            Message: "Sign In Successful",
            Status: "Success",
            data: client,
            accessToken : generateToken
        })
    } catch (error) {
        console.log(error);
        next(error)

    }
}
module.exports = {
    Signup,
    SignIn
}