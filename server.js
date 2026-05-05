const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const connectDatabase = require("./ConnectDatabase/dbConnect");
const clientRouter = require("./Router/clientRouter");
const handleError = require("./HandleError/ErrorHandler");
const AgentRouter = require("./Router/AdminRouter");

dotenv.config();

const app = express();
const PORT = process.env.PORT;


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/users", clientRouter);
app.use("/agent", AgentRouter)

app.get("/", (req, res) => {
    res.send("PropVista API is running...");
});

connectDatabase()    



app.use("/{*any}", handleError)

app.all("/{*any}", (req, res) => {
    res.status(500).json({
        Message: `${req.method} ${req.originalUrl} is not a vaild endpoint on this server`,
    });
});