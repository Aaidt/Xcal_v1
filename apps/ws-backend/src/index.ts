import { WebSocketServer, WebSocket } from "ws";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 })

interface User {
    userId: string,
    ws: WebSocket,
    rooms: string[]
}
const users: User[] = []

wss.on("connection", function connect(ws) {
    let authorized: boolean;

    ws.on('error', console.error)
    ws.send("You are connected to the websocket server.")

    ws.on("message", async function message(data) {
        let parsedData;
        try {
            parsedData = JSON.parse(data.toString());
        } catch (err) {
            ws.send("Incorrect message format.")
            console.error("Error: " + err)
            return
        }


        if (parsedData.type === "auth") {
            const userId = parsedData.userId
            const slug = parsedData.slug

            try {
                const user = await prismaClient.room.findFirst({
                    where: {
                        slug,
                        OR: [
                            { adminId: userId },
                            { link: { link: parsedData.link } }
                        ]
                    }
                })
                if (!user) {
                    ws.send("Not authorized. Given userId doesnt match.");
                    return;
                }
                authorized = true;
                ws.send("You are authorized");

                users.push({
                    userId,
                    ws,
                    rooms: []
                });
            } catch (err) {
                ws.send("Server error. Closing the connection.");
                ws.close();
                console.log("Error: " + err);
            }
        }

        if (authorized) {
            const user = users.find(user => user.ws === ws);
            if(!user){
                ws.send("No user found...");
                ws.close();
                return 
            }

            if (parsedData.type === "join-room") {

                const link = parsedData.link;
                try {
                    const room = await prismaClient.link.findFirst({
                        where: { link },
                        select: { roomId: true }
                    });
                    if(!room || !room.roomId){
                        ws.send("Cannot find the room corresponding to this link");
                        return
                    }

                    user.rooms.push(room.roomId);
                } catch (err) {
                    ws.send("Error in fetching the rooms.")
                    console.error("Error is: " + err);
                }
            }
        }
    })


})

wss.on("listening", () => console.log("Server is listening on port 8080."))