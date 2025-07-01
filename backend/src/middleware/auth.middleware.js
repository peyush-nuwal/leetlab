import jwt from "jsonwebtoken"
import {db} from "../libs/db.js"

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log("🔒 Incoming Token:", token); // ✅ check if it's present

    if (!token) {
      console.log("⛔ No token found in cookies");
      return res.status(401).json({ message: "Please login" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded JWT Payload:", payload);

    const user = await db.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        image: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      console.log("❌ User not found in DB");
      return res.status(404).json({ message: "No user found" });
    }

    console.log("✅ Authenticated User:", user);

    req.user = user;
    next();
  } catch (error) {
    console.error("🔥 JWT Verification Error:", error.message);
    return res.status(401).json({ message: "Error in authentication" });
  }
};


export const checkAdmin = async (req, res, next) => {
    try {
        const userId = req.user.id;
        console.log("UserId: ", userId)

        const user = await db.user.findUnique({
            where: {
                id: userId
            },
            select: {
                role: true
            }
        }) 
        
        
        if (!user || user.role !== "ADMIN") {
            return res.status(403).json({
                message: "You cannot access this route"
            })
        }
        
        next();
        

    } catch (error) {
        console.error("Error in checking admin role: ", error);
        return res.status(400).json({
            message: "Error in checking admin role"
        })
    }
}

