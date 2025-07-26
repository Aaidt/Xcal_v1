import { WebSocketServer, WebSocket } from "ws";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 })

let authorized: boolean;
wss.on("connection", function connect(ws){
    ws.on('error', console.error)
    ws.send("You are connected to the websocket server.")

    ws.on("message", async function message(data: string){
        const parsedData = JSON.parse(data);
        if(parsedData.type === "auth"){
            const userId = parsedData.userId
            const slug  = parsedData.slug
            
            const user = await prismaClient.room.findFirst({ 
                where: { 
                    slug,
                    OR: [
                        { adminId: userId },
                        { user: { some: { id: userId } } }
                    ]
                } 
            })
            if(!user){
                ws.send("Not authorized. Given userId doesnt match.");
                return;
            }
        }



    })

})

wss.on("listening", () => console.log("Server is listening on port 8080."))