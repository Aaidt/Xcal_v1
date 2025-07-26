import { Router, Request, Response } from "express"
import { prismaClient } from '@repo/db/client';

const roomRouter: Router = Router();

roomRouter.post("/createRoom", async function (req: Request, res: Response) {
    const { userId, slug } = req.body;

    try{
        const room = await prismaClient.room.create({
            data: {
                slug,
                admin: { connect: { id: userId } }
            }
        })

        if(!room){
            res.status(402).json({
                message: "Error creaing room"
            })
            return
        }

        res.status(200).json({ 
            message: "room created",
            roomId: room.id 
        })
    }catch(err){
        console.log("Server error. Could not create room.");
        res.status(500).json({ message: "Server error. Could not create room." })
    }
})

export default roomRouter