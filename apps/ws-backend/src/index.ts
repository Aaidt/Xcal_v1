import { WebSocketServer, WebSocket } from "ws";
import { prismaClient } from "@repo/db/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()

const wss = new WebSocketServer({ port: 8080 })

interface data {
    type: "join_room" | "leave_room" | "chat" | "visitor_count",
    link?: string,
    shape?: string,
    roomId: string  
}


interface User {
    userId: string,
    ws: WebSocket,
    rooms: string[]
}

let users: User[] = []

const roomVisitors: { [roomId: string]: Set<string> } = {};

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

function broadcast_visitor_count(roomId: string){
    const count: number = roomVisitors[roomId]?.size || 0

    users.forEach(u => {
        if(u.rooms.includes(roomId)){
            u.ws.send(JSON.stringify({ type: "visitor_count", visitors: count }))
        }
    })
    console.log(`Updated visitor count for room ${roomId}: ${count}`);
}

wss.on("connection", function connect(ws, request) {
    
    const url = request.url;
    if(!url){
        console.log("Wrong url.")
        ws.send(JSON.stringify({ message: "Wrong url." }))
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
    
    const user: User = {
        ws,
        userId,
        rooms: []
    }
    users.push(user);
    
    ws.send(JSON.stringify({ message: "You are connected to the websocket server." }))
    console.log("You are connected to the websocket server.");
    
    ws.on("message", async function message(data) {
        let parsedData: data;
        try {
            parsedData = JSON.parse(data.toString());
        } catch (err) {
            ws.send(JSON.stringify({ message: "Incorrect message format." + err }))
            console.log("Incorrect message format.")
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
                    console.log("Cannot find the room corresponding to this link")
                    return
                }

                if(!roomVisitors[room.roomId]){
                    roomVisitors[room.roomId] = new Set();
                }
                roomVisitors[room.roomId]?.add(user.userId);

                if(!user.rooms.includes(room.roomId)){
                    user.rooms.push(room.roomId);
                }
                
                ws.send(JSON.stringify({ status: "Success", message: "Joined the room: " + room.roomId }));
                console.log("Joined the room: " + room.roomId)

                broadcast_visitor_count(room.roomId);

            } catch (err) {
                ws.send(JSON.stringify({ status: "Failed", message: "Error in fetching the rooms." }) );
                console.error("Error is: " + err);
            }
        }

        if(parsedData.type === "leave_room"){
            const wasInRoom = user.rooms.includes(parsedData.roomId);
            if(!wasInRoom) return;
            
            user.rooms = user.rooms.filter(roomId => roomId !== parsedData.roomId);

            roomVisitors[parsedData.roomId]?.delete(user.userId)
            if(roomVisitors[parsedData.roomId]?.size === 0){
                delete roomVisitors[parsedData.roomId]
            }

            ws.send(JSON.stringify({ 
                status: wasInRoom ? "Success" : "Failed",
                message: wasInRoom ? "Successfully Left the room." : "you are not in this room" 
            }))

            broadcast_visitor_count(parsedData.roomId);
        }

        if(parsedData.type === "chat"){
            const roomId = parsedData.roomId;
            const shape = parsedData.shape;
            
            if(!shape || !roomId){
                ws.send(JSON.stringify({ status: "Failed", message: "No shapes or roomId sent." }))
                console.log("No shapes or roomId sent.")
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
    ws.on('error', console.error)

    ws.on("close", () => {
        console.log(`WebSocket closed for userId: ${user.userId}`);
        
        const index = users.findIndex(u => u.ws === ws);
        if (index !== -1) {
            users.splice(index, 1);
        }

        user.rooms.forEach(roomId => {
            roomVisitors[roomId]?.delete(user.userId);

            if(roomVisitors[roomId]?.size === 0){
                delete roomVisitors[roomId]
            }

            broadcast_visitor_count(roomId);
        })

    })

})

wss.on("listening", () => console.log("Server is listening on port 8080."))