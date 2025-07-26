import { Router, Request, Response } from "express";
import { prismaClient } from '@repo/db/client';
import { compare, hash } from "bcrypt"

const authRouter: Router = Router();

authRouter.post("/signup", async function (req:Request, res: Response) {
    const { username, password } = req.body;
    
    const hashedPassword = hash(password, 6);

    try{
        const user = await prismaClient.user.create({
            data: {
                username,
                password: hashedPassword
            }
        })

        if(!user){
            console.log("Failed to create the user")
            res.status(402).json({ message: "Failed to create the user" })
        }
        res.status(200).json({ 
            message: "User created successfully.",
            userId: user.id 
        })


    }catch(err){
        console.log("Server error.")
        res.status(500).json({ message: "Server error. Could not sign the user in." })
    }
})

authRouter.post("/signin", async function (req:Request, res: Response) {
    const { username, password } = req.body;
    
    try{
        const user = await prismaClient.user.findFirst({
            where: { username }
        })

        if(password !== user.password){
            console.log("Incorrect password")
            res.status(403).json({ message: "Incorrect credentials" })
        }

        res.status(200).json({ 
            message: "signed in.",
            userId: user.id
        })

    }catch(err){
        console.log("Server error.")
        res.status(500).json({ message: "Server error. Could not sign the user in." })
    }
})

export default authRouter   