
const expresss = require("express")
const uploadAdminProfile = require("../ImagesMiddleware/UploadProfilepic")
const { SignUp, SignIn, verifyToken, updateAgent, logout, getSingleAgent, getAllAgents } = require("../AdminAuth/Auth")
const isAgentLoggedIn = require("../AgentMiddleware/isAgentLoggedIn")
const uploadPropertyImg = require("../ImagesMiddleware/UploadProperty")
const { postProperty, allProperties } = require("../Controller/PropertyController")


const AgentRouter = expresss.Router()



AgentRouter.post("/auth/signup", uploadAdminProfile.single("profileImage"), SignUp)

AgentRouter.post("/auth/signin", SignIn)
AgentRouter.patch("/auth/update/:agentId", isAgentLoggedIn, updateAgent)
AgentRouter.get("/single/:agentId", isAgentLoggedIn, getSingleAgent)
AgentRouter.get("/all", isAgentLoggedIn, getAllAgents)
AgentRouter.post("/auth/verify_token", verifyToken)
AgentRouter.post("/auth/logout", logout)



// Property
AgentRouter.post("/post/property", uploadPropertyImg.single("image"), isAgentLoggedIn, postProperty)

     
// For Users(Mostly)          
// Just testing for Agents
AgentRouter.get("/property/all", isAgentLoggedIn, allProperties)
module.exports = AgentRouter