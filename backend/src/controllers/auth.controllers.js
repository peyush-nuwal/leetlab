import bcrypt from "bcryptjs"
import {db} from "../libs/db.js"
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
    const {email, password, name} = req.body;

    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)
    console.log(`Name: ${name}`)

    try {
        const exsistingUser = await db.user.findUnique({
            where: {
                email: email
            }
        })

        console.log(`Exsisting user: ${exsistingUser}`)

        if (exsistingUser) {
            return res.status(400).json({
                error: "User already exsists"
            })
        }

        const hashedPassowrd = await bcrypt.hash(password, 10);

        console.log(`hashed Passoword: ${hashedPassowrd}`)

        const newUser = await db.user.create({
            data: {
                email, 
                password: hashedPassowrd, 
                name,
                role: UserRole.USER
            }
        })

        const token = jwt.sign({id: newUser.id}, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("jwt", token, {
            httpOnly: true,
            sameStie: "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 1000*60*60*24*7
        })

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                image: newUser.image
            }
        })
    } catch (error) {
        console.log(`error in registering user: ${error}`)
    }
}

export const login = async (req, res) => {

}

export const logout = async (req, res) => {

}

export const check = async (req, res) => {

}