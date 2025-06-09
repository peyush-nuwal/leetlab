import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import executionRoute from "./routes/executCode.routes.js";
import submissionRoutes from "./controllers/submission.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import cors from "cors"

dotenv.config()
const app = express()
const port = process.env.PORT || 3000

app.use(
    cors({
      origin: ["http://localhost:5173", "https://leetlab-drab.vercel.app"],
      credentials: true,
    })
  );

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())


app.get("/", (req, res) => {
    res.send("Hello, welcome to leet lab")
})


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execute-code", executionRoute);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playlistRoutes);


app.listen(port, () => { 
     console.log(`Listening on port ${port}`);
})

