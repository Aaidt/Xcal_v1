import { Router, Request, Response } from "express"
import { prismaClient } from '@repo/db/client';
import { hash } from "bcrypt";

const roomRouter: Router = Router();

roomRouter.post("/create", async function (req: Request, res: Response) {
    const { slug } = req.body;
    const userId = req.userId

    try{
        const room = await prismaClient.room.create({
            data: {
                slug,
                admin: { connect: { id: userId } }
            }
        })

        if(!room){
            res.status(402).json({ message: "Error creaing room" })
            return
        }

        const link = await hash(slug, 10);

        const generatedLink = await prismaClient.link.create({
            data:{
                link,
                room: { connect: { id: room.id}}
            }
        })
        if(!generatedLink){ 
            res.status(402).json({ message: "Error saving the link." })
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

roomRouter.delete("/deleteRoom/:roomId", async function (req: Request<{roomId: string}>, res: Response) {
    const userId = req.userId;
    const { roomId } = req.params;

    try{
        const room = await prismaClient.room.delete({ where: { id: roomId, adminId: userId } })

        res.status(200).json({ message: "room deleted" + room.id  })
    }catch(err){
        console.log("Server error. Could not delete room.");
        res.status(500).json({ message: "Server error. Could not delete room." })
    }
})

roomRouter.delete("/deleteAll", async function (req: Request, res: Response) {
    const userId = req.userId;

    try{
        await prismaClient.room.deleteMany({ where: { adminId: userId } })

        res.status(200).json({ message: "All rooms deleted"})
    }catch(err){
        console.log("Server error. Could not delete rooms.");
        res.status(500).json({ message: "Server error. Could not delete rooms." })
    }
})

roomRouter.get("/admin", async function (req: Request, res: Response) {
    const userId = req.userId;

    try{
        const rooms = await prismaClient.room.findMany({ 
            where: { adminId: userId },
            select: { 
                link: true,
                created_at: true,
                slug: true
            }
        })

        res.status(200).json({ adminRooms: rooms  })
    }catch(err){
        console.log("Server error. Could not find room.");
        res.status(500).json({ message: "Server error. Could not find room." })
    }
})

roomRouter.get("/visited", async function (req: Request, res: Response) {
    const userId = req.userId;

    try{
        const rooms = await prismaClient.room.findMany({ where: { user: { some: { id: userId } } } })

        res.status(200).json({ visitedRooms: rooms })
    }catch(err){
        console.log("Server error. Could not find room.");
        res.status(500).json({ message: "Server error. Could not find room." })
    }
})

roomRouter.get("/:slug", async function (req: Request<{slug: string}>, res: Response) {
    const slug = req.params.slug
    const userId = req.userId;

    try{
        const room = await prismaClient.room.findFirst({
            where: { 
                slug, 
                OR: [
                    { adminId: userId },
                    { user: { some: { id: userId } } }
                ]
            },
            select: {
                link: true, 
                id: true 
            }
        })

        if(!room){
            console.log("Room could not fetched")
            res.status(403).json({ message: "Room could not fetched" })
            return 
        }
        res.status(200).json({ 
            roomId: room.id, 
            link: room.link 
        })

    }catch(err){
        console.log("Server error. Could not fetch the room.")
        res.status(500).json({ message: "Server error. Could not fetch the room." })
    }
})

roomRouter.post("/shapes/:roomId", async function (req: Request<{roomId: string}>, res: Response){
    const { roomId } = req.params
    const shape = req.body.shape;
    const shapeId = req.body.shapeId

    try{
        await prismaClient.shape.upsert({
            where: { id: shapeId },
            create: { 
                shape,
                room: { connect: { id: roomId } }
            },
            update: { shape }
    })
    }catch(err){
        res.status(500).json({ message: "Server error. could not insert shapes" })
    }
})

roomRouter.get("/shapes/:roomId", async function (req: Request<{roomId: string}>, res: Response){
    const { roomId } = req.params

    try{
        const shapes = await prismaClient.shape.findMany({ where: { roomId } })
        res.status(200).json({ shapes })
    }catch(err){
        res.status(500).json({ message: "Server error. could not insert shapes" })
    }
})

export default roomRouter