
const expresss = require("express")
const uploadAdminProfile = require("../ImagesMiddleware/UploadProfilepic")
const { SignUp, SignIn, verifyToken, updateAgent, logout, getSingleAgent, getAllAgents } = require("../AdminAuth/Auth")
const isAgentLoggedIn = require("../AgentMiddleware/isAgentLoggedIn")


const AgentRouter = expresss.Router()



AgentRouter.post("/auth/signup", uploadAdminProfile.single("profileImage"), SignUp)

AgentRouter.post("/auth/signin", SignIn)
AgentRouter.patch("/auth/update/:agentId", isAgentLoggedIn, updateAgent)
AgentRouter.get("/single/:agentId", isAgentLoggedIn, getSingleAgent)
AgentRouter.get("/all", isAgentLoggedIn,getAllAgents)
AgentRouter.post("/auth/verify_token", verifyToken)
AgentRouter.post("/auth/logout", logout)


module.exports = AgentRouter