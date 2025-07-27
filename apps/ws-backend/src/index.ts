import { WebSocketServer, WebSocket } from "ws";
import { prismaClient } from "@repo/db/client";
import jwt from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 })

interface data {
    type: "join_room" | "leave_room" | "chat",
    link?: string,
    shape?: string,
    roomId: string
}


interface User {
    userId: string,
    ws: WebSocket,
    rooms: string[]
}
const users: User[] = []

const JWT_SECRET = process.env.JWT_SECRET as string;

function verify(token: string): string | null {

    if(typeof token !== "string"){
        console.log("Incorrect jwt token.");
        return null
    }
    try{
        const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
        if(!decoded.userId){
            console.log("No user Id.")
            return null
        }
        return decoded.userId;
    }catch(err){
        console.log("Error: " + err);
        return null;
    }
}


wss.on("connection", function connect(ws, request) {
    ws.on('error', console.error)

    const url = request.url;
    if(!url){
        ws.send("Wrong url.")
        return
    }

    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get('token') ?? "";

    const userId = verify(token);
    if(userId === null){
        console.log("Not authorized.")
        ws.close()
        return
    }

    users.push({
        ws,
        userId,
        rooms: []
    })

    ws.send("You are connected to the websocket server.")

    ws.on("message", async function message(data) {
        let parsedData: data;
        try {
            parsedData = JSON.parse(data.toString());
        } catch (err) {
            ws.send("Incorrect message format." + err)
            return
        }

        const user = users.find(user => user.ws === ws);
        if (!user) {
            ws.send(JSON.stringify({ status: "Failed", message: "No users found..." }));
            ws.close();
            return
        }

        if (parsedData.type === "join_room") {
            const link = parsedData.link;
            try {
                const room = await prismaClient.link.findFirst({
                    where: { link },
                    select: { roomId: true }
                });
                if (!room || !room.roomId) {
                    ws.send(JSON.stringify({ status: "Failed", message: "Cannot find the room corresponding to this link" }));
                    return
                }

                user.rooms.push(room.roomId);
                ws.send(JSON.stringify({ status: "Success", message: "Joined the room: " + room.roomId }));
            } catch (err) {
                ws.send(JSON.stringify({ status: "Failed", message: "Error in fetching the rooms." }) );
                console.error("Error is: " + err);
            }
        }

        if(parsedData.type === "leave_room"){
            const wasInRoom = user.rooms.includes(parsedData.roomId);
            if(!wasInRoom) return;
            
            user.rooms = user.rooms.filter(roomId => roomId !== parsedData.roomId);

            ws.send(JSON.stringify({ 
                status: wasInRoom ? "Success" : "Failed",
                message: wasInRoom ? "Successfully Left the room." : "you are not in this room" 
            }))
        }

        if(parsedData.type === "chat"){
            const roomId = parsedData.roomId;
            const shape = parsedData.shape;

            if(!shape || !roomId){
                ws.send(JSON.stringify({ status: "Failed", message: "No shapes or roomId sent." }))
                return
            }

            try{
                await prismaClient.shape.create({
                    data: { 
                        shape, 
                        room: { connect: { id: roomId } }
                    }
                })
            }catch(err){
                ws.send(JSON.stringify({ status: "Failed", message: "Could not save the message in the db." }))
                console.log("Error: " + err);
            }

            users.forEach(user => {
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({ type: "chat", shape }))
                }
            })

        }


    })
})

wss.on("listening", () => console.log("Server is listening on port 8080."))