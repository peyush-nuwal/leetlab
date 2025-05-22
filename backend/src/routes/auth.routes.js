import express from "express"
import { register, login, check, logout } from "../controllers/auth.controllers.js"

const authRoutes = express.Router()

authRoutes.post("/register", register)

authRoutes.post("/login", login)
authRoutes.get("/logout", logout)
authRoutes.get("/check", check)

export default authRoutes;
