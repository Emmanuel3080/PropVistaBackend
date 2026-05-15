const AgentModel = require("../Model/AdminModel")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

const bcrypt = require("bcryptjs")
const blackListedTokenModel = require("../Model/BlacklistedTokenModel")

const SignUp = async (req, res, next) => {
    const { password, fullName, email } = req.body

    const imageFile = req.file
    if (!imageFile) {
        return res.status(404).json({
            Message: "No Image fIle Found",
            Status: "Error"
        })
    }     
    try {                                 

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const agent = await AgentModel.create({ ...req.body, password: hashedPassword, profileImage: imageFile.path })

        const agentInfo = {
            id: agent?._id,
            name: agent?.fullName,
            email: agent?.email,
            agencyName: agent?.agencyName,
            phoneNumber: agent?.phone,
            location: agent?.location,
            profileImage: agent?.profileImage,
        };
        if (!agent) {
            return res.status(400).json({
                Message: "Failed to Create Agent Profile",
                Status: "Error"
            })
        }



        return res.status(201).json({
            Message: "Sign Up Successful",
            Status: "Success",
            data: agentInfo
        })
     

    } catch (error) {
        console.log(error);
        next(error)

    }
}



const SignIn = async (req, res, next) => {
    const { userEmail, password } = req.body


    // if (!userEmail || !password) {
    //     return res.status(400).json({
    //         Message: "All Fields are Required",
    //         Status: "Error"
    //     })
    // }


    try {
        const user = await AgentModel.findOne({ email: userEmail }).select("+password")

        if (!user) {
            return res.status(404).json({
                Message: "Email or Password Incorrect",
                Status: "Error"
            })
        }
                              

        // return res.status(200).json({
        //     user
        // })



        const isMatch = await bcrypt.compare(password, user.password)


        if (!isMatch) {
            return res.status(404).json({
                Message: "Email or Password Incorrect",
                Status: "Error"
            })
        }

        const agentInfo = {
            id: user?._id,
            name: user?.fullName,
            email: user?.email,
            agencyName: user?.agencyName,
            phoneNumber: user?.phone,
            location: user?.location,
            profileImage: user?.profileImage,
        };


        const generateToken = await jwt.sign({
            userId: user?._id, userEmail: user?.email
        }, process.env.jwtAgentToken, {
            expiresIn: process.env.jwtAgentExpiry
        })
        return res.status(200).json({
            Message: "Sign In Successful",
            Status: "Success",
            userDetails: agentInfo,
            accessToken: generateToken
            // isMatch
        })

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
            return res.status(404).json({
                Message: "Token Not Found",
                Status: "Error"
            })
        }


        // Check if Token has been Blacklisted

        const isTokenBlacklisted = await blackListedTokenModel.findOne({ token: token })
        if (isTokenBlacklisted) {
            return res.status(400).json({
                Message: "Token has been Blacklisted",
                Status: "Error"
            })
        }

        // Verify the Token
        const { userId } = await jwt.verify(token, process.env.jwtAgentToken)

        const user = await AgentModel.findById(userId)
        // if(!user){
        //     return res.status(404).json({
        //         Message : "User Not Found"
        //     })
        // }

        return res.status(200).json({
            Message: "Token is Valid",
            Status: "Success",
            user
        })


    } catch (error) {
        console.log(error);
        next(error)

    }
}


const updateAgent = async (req, res, next) => {
    const { agentId } = req.params
    try {
        const updateDetails = await AgentModel.findOneAndUpdate(
            { _id: agentId },
            { ...req.body },
            { returnDocument: "after" }
        )

        if (!updateDetails) {
            return res.status(401).json({
                Message: "Unable to Update Agent Details"
            })

        }

        return res.status(201).json({
            Message: "Updated Successfully",
            Status: "Success",
            agent: updateDetails
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



const getSingleAgent = async (req, res, next) => {
    const { agentId } = req.params
    try {
        const agent = await AgentModel.findById(agentId)

        if (!agent) {
            return res.status(404).json({
                Message: "Agent Not Found",
                Status: "Error"
            })
        }

        return res.status(200).json({
            Message: "Agent Details Feched Successfuly",
            Status: "Success",
            agent
        })
    } catch (error) {
        console.log(error);
        next(error)

    }
}


const getAllAgents = async (req, res, next) => {
    try {
        const agents = await AgentModel.find()

        if (!agents) {
            return res.status(404).json({
                Message: "Unable to Fetch All Agents",
                Status: "Error"
            })
        }


        return res.status(200).json({
            Message: "All Agent Details Fetched",
            Status: "Success",
            No_of_Registered_Agents: agents.length,
            agents
        })
    } catch (error) {
        console.log(error);
        next(error)

    }               
}
module.exports = {
    SignUp,
    SignIn,
    updateAgent,
    getSingleAgent,
    getAllAgents,
    verifyToken,
    logout
}       