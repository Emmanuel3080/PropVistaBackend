const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const cors = require("cors")
dotenv.config()


const portNumber = process.env.port
const app = express()
app.listen(portNumber, () => {
    console.log(`Port Running at http://localhost:${portNumber}`);

})
app.use(cors())
app.use(morgan("dev"))


app.get("/", (req, res) => {
    res.send("My Properties")
})