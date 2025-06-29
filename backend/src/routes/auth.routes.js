import express from "express"
import { register, login, check, logout } from "../controllers/auth.controllers.js"
import { authMiddleware } from "../middleware/auth.middleware.js"
import passport from "passport";
import "../auth/google.js"; // Register strategy
import { googleCallback } from "../controllers/auth.controllers.js";


const authRoutes = express.Router()

authRoutes.post("/register", register)

authRoutes.post("/login", login)
authRoutes.get("/logout", authMiddleware, logout)
authRoutes.get("/check", authMiddleware, check)

authRoutes.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

authRoutes.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
);


export default authRoutes;
