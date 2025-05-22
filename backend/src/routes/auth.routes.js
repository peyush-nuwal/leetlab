import express from "express"
import { register, login, check, logout } from "../controllers/auth.controllers.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const authRoutes = express.Router()

authRoutes.post("/register", register)

authRoutes.post("/login", login)
authRoutes.get("/logout", authMiddleware, logout)
authRoutes.get("/check", authMiddleware, check)

export default authRoutes;
