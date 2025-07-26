import express, { Request, Response } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"  

const app = express();

app.use(express.json())
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL || "http://localhost:3001"
}));
app.use(cookieParser())


// routes


app.listen(3000, () => { console.log("Server is listening on port 3000") });