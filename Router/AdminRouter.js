
const expresss = require("express")
const uploadAdminProfile = require("../ImagesMiddleware/UploadProfilepic")
const { SignUp, SignIn, verifyToken, updateAgent } = require("../AdminAuth/Auth")


const AgentRouter = expresss.Router()



AgentRouter.post("/auth/signup", uploadAdminProfile.single("profileImage"), SignUp)

AgentRouter.post("/auth/signin", SignIn)
AgentRouter.patch("/auth/update/:agentId", updateAgent)
AgentRouter.post("/auth/verify_token", verifyToken)


module.exports = AgentRouter