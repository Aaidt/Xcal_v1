import { WebSocketServer, WebSocket } from "ws";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 })

interface User {
    userId: string,
    ws: WebSocket,
    rooms: string[]
}

wss.on("connection", function connect(ws){
    let authorized: boolean;
    const users: User[] = []

    ws.on('error', console.error)
    ws.send("You are connected to the websocket server.")

    ws.on("message", async function message(data){
        let parsedData;
        try{
            parsedData = JSON.parse(data.toString());
        }catch(err){
            ws.send("Incorrect message format.")
            console.error("Error: " + err)
            return
        }


        if(parsedData.type === "auth"){
            const userId = parsedData.userId
            const slug  = parsedData.slug
            
            try{
                const user = await prismaClient.room.findFirst({ 
                    where: { 
                        slug,
                        OR: [
                            { adminId: userId },
                            { link: { link: parsedData.link } }
                        ]
                    } 
                })
                if(!user){
                    ws.send("Not authorized. Given userId doesnt match.");
                    return;
                }
            }catch(err){
                ws.send("Server error. Closing the connection.");
                ws.close();
                console.log("Error: " + err);
            } finally {
                authorized = true;
                ws.send("You are authorized");
                
            }
        }

        if(parsedData.type === "join-room"){
            if(!authorized){
                ws.send("You are not authorized.")
                ws.close();
                return 
            }

        }

    })

})

wss.on("listening", () => console.log("Server is listening on port 8080."))