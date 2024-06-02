import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import {connect} from "./config/connect.js"
import userRouter from "./routers/user.router.js"
import accountRouter from "./routers/account.router.js"
import transactionRouter from "./routers/transaction.router.js"
import "./utils/scheduler.js"

import dotenv from "dotenv"
dotenv.config();

const PORT = process.env.PORT || 5001
const app = express()

connect()

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api/user" , userRouter)
app.use("/api/account" , accountRouter)
app.use("/api/transaction" , transactionRouter)

app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`)
})