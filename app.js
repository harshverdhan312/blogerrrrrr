const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import 
const { router:userRouter } = require("./routes/user.routes.js")
const { router:blogRouter } = require("./routes/blog.routes.js")
const { router:healthCheckRouter } = require("./routes/healthcheck.routes");
const { router:followRouter } = require("./routes/follow.routes.js")
const { router:likeRouter } = require("./routes/like.routes.js")
const { router:commentRouter }= require("./routes/comment.routes.js")

//routes declaration

app.use("/api/v1/users", userRouter)
app.use("/api/v1/blogs", blogRouter)
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/follow",followRouter)
app.use("/api/v1/like",likeRouter)
app.use("/api/v1/comment",commentRouter)


module.exports = {app}