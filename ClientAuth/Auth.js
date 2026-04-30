const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const clientModel = require("../Model/clientModel")
const dotenv = require("dotenv")
const blackListedTokenModel = require("../Model/BlacklistedTokenModel")
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
            phoneNumber: client?.phoneNumber
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

        const userDetails = {
            fullName: client?.fullName,
            id: client?._id,
            email: client?.email,
            phoneNumber: client?.phoneNumber
        }

        return res.status(200).json({
            Message: "Sign In Successful",
            Status: "Success",
            data: userDetails,
            accessToken: generateToken
        })
    } catch (error) {
        console.log(error);
        next(error)

    }
}


const getClient = async (req, res, next) => {
    const { clientId } = req.params
    if (!clientId) {
        return res.status(400).json({
            Message: "User ID not provided",
            Status: "Error"
        });
    }
    try {
        const user = await clientModel.findById(clientId)
        if (!user) {
            return res.status(404).json({
                Message: "User Not Found",
                Status: "Error"
            })
        }

        return res.status(200).json({
            Message: "User Information Fetched Successfully",
            Status: "Success",
            data: user
        })
    } catch (error) {
        console.log(error);
        next(error)

    }
}



const allUser = async (req, res, next) => {
    try {
        const users = await clientModel.find()
        if (!users) {
            return res.status(404).json({
                Message: "Unable to fetch users",
                Status: "Error"
            })
        }

        return res.status(200).json({
            Message: "All Users Information Fetched Successfully",
            Status: "Success",
            No_Of_Users: users.length,
            data: users
        })


    } catch (error) {
        console.log(error);
        next(error)

    }
}

const updateUser = async (req, res, next) => {
    const { userId } = req.params
    if (!userId) {
        return res.status(400).json({
            Message: "UserId ID not provided",
            Status: "Error"
        });
    }
    try {
        const user = await clientModel.findOneAndUpdate({ _id: userId }, { ...req.body }, { returnDocument: "after" })
        if (!user) {
            return res.status(404).json({
                Message: "User not found",
                Status: "Error"
            });
        }

        return res.status(200).json({
            Message: `${req.body.field || "User"} profile updated successfully`,
            Status: "Success",
            data: user
        });
    } catch (error) {
        console.log(error);
        next(error)

    }
}

const verifyToken = async (req, res, next) => {
    let token;

    try {

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]
        }
        if (!token) {
            return res.status(400).json({
                Message: "Token Not Found",
                Status: "Error"
            })
        }

        const { userId } = jwt.verify(token, process.env.jwtUserToken)

        const user = await clientModel.findById(userId)
        return res.status(200).json({
            Message: "Token is valid",
            Status: "Success",
            user

        })

    } catch (error) {
        console.log(error);
        next(error)
    }
}


const logout = async (req, res, next) => {
    const { token } = req.body

    if (!token) {
        return res.status(404).json({
            Message: "Token Not Found",
            Status: "Error"
        })
    }

    try {

        await blackListedTokenModel.create({ token })

        return res.status(201).json({
            Message: "Logout Successful, Token has been Blacklisted",
            Status: "Error"
        })
        // const 
    } catch (error) {
        console.log(error);
        next(error)
    }
}
module.exports = {
    Signup,
    SignIn,
    getClient,
    allUser,
    updateUser,
    verifyToken,
    logout
}