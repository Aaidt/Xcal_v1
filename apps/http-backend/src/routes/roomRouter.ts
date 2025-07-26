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

roomRouter.delete("/deleteRoom", async function (req: Request, res: Response) {
    const { userId, slug } = req.body;

    try{
        const room = await prismaClient.room.delete({ where: { slug, adminId: userId } })

        res.status(200).json({ message: "room deleted" + room.id  })
    }catch(err){
        console.log("Server error. Could not delete room.");
        res.status(500).json({ message: "Server error. Could not delete room." })
    }
})

roomRouter.get("/admin", async function (req: Request, res: Response) {
    const { userId } = req.body;

    try{
        const room = await prismaClient.room.findFirst({ where: { adminId: userId }})

        if(!room){
            console.log("No rooms found")
            res.status(404).json({ message: "No rooms found" })
            return
        }

        res.status(200).json({ message: "room deleted" + room.id  })
    }catch(err){
        console.log("Server error. Could not find room.");
        res.status(500).json({ message: "Server error. Could not find room." })
    }
})

roomRouter.get("/visited", async function (req: Request, res: Response) {
    const { userId } = req.body;

    try{
        const room = await prismaClient.room.findFirst({ where: { user: { some: { id: userId } } } })

        if(!room){
            console.log("No rooms found")
            res.status(404).json({ message: "No rooms found" })
            return
        }

        res.status(200).json({ visited: room })
    }catch(err){
        console.log("Server error. Could not find room.");
        res.status(500).json({ message: "Server error. Could not find room." })
    }
})

roomRouter.get("/:slug", async function (req: Request<{slug: string}>, res: Response) {
    const slug = req.params.slug
    const userId = req.body;

    try{
        const room = await prismaClient.room.findFirst({
            where: { 
                slug, 
                OR: [
                    { adminId: userId },
                    { user: { some: { id: userId } } }
                ]
            }
        })

        if(!room){
            console.log("Room could not fetched")
            res.status(403).json({ message: "Room could not fetched" })
            return 
        }
        res.status(200).json({ room })

    }catch(err){
        console.log("Server error. Could not fetch the room.")
        res.status(500).json({ message: "Server error. Could not fetch the room." })
    }
})

roomRouter.post("/shapes/:roomId", async function (req: Request<{roomId: string}>, res: Response){
    const { roomId } = req.params
    const shape = req.body.shape;
    const userId = req.body.userId;
    const shapeId = req.body.shapeId

    try{
        await prismaClient.shape.upsert({
            where: { id: shapeId },
            create: { 
                shape,
                room: { connect: { id: roomId } },
                user: { connect: { id: userId }}
            },
            update: { shape }
    })
    }catch(err){
        res.status(500).json({ message: "Server error. could not insert shapes" })
    }
})

export default roomRouter