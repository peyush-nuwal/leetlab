import jwt from "jsonwebtoken"
import {db} from "../libs/db.js"

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        
        if (!token) {
            return res.status(401).json({
                message: "Please login"
            })

        } 

        const payload = jwt.verify(token, process.env.JWT_SECRET);

        console.log(payload)

        const user = await db.user.findUnique({
            where: {
                id: payload.id
            },
            select: {
                id: true,
                image: true,
                name: true,
                email: true,
                role: true
            }
        })
        
        if (!user) {
            return res.status(404).json({
                message: "No user found"
            })
        }

        // now i am having a user 
        req.user = user;
        
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Error in authentication"
        })
    }
}

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
        
        next();

        if (!user || user.role !== "ADMIN") {
            return res.status(403).json({
                message: "You cannot access this route"
            })
        }


    } catch (error) {
        console.error("Error in checking admin role: ", error);
        return res.status(400).json({
            message: "Error in checking admin role"
        })
    }
}

