
const jwt = require("jsonwebtoken")

const dotenv = require("dotenv");
const blackListedTokenModel = require("../Model/BlacklistedTokenModel");
const clientModel = require("../Model/clientModel");
dotenv.config()


const isUserLoggedIn = async (req, res, next) => {

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


        // Check if Token hasn't been Balcklisted

        const verifyToken = await blackListedTokenModel.findOne({ token: token })
        if (verifyToken) {
            return res.status(400).json({
                Message: "Token has been Blacklisted",
                Status: "Error"
            })
        }

        // Check if token has expired/valid; (jwt)

        const { userId } = await jwt.verify(token, process.env.jwtUserToken)


        const user = await clientModel.findById(userId)

        req.user = user
        next()
    } catch (error) {
        console.log(error);
        next(error)

    }





}


module.exports = isUserLoggedIn