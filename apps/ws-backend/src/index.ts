import { WebSocketServer, WebSocket } from "ws";
import { prismaClient } from "@repo/db/client";
import jwt from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 })

interface User {
    userId: string,
    ws: WebSocket,
    rooms: string[]
}
const users: User[] = []

const JWT_SECRET = process.env.JWT_SECRET;

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
        let parsedData;
        try {
            parsedData = JSON.parse(data.toString());
        } catch (err) {
            ws.send("Incorrect message format." + err)
            return
        }

        const user = users.find(user => user.ws === ws);
        if (!user) {
            ws.send("No user found...");
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
                    ws.send("Cannot find the room corresponding to this link");
                    return
                }

                user.rooms.push(room.roomId);
            } catch (err) {
                ws.send("Error in fetching the rooms.")
                console.error("Error is: " + err);
            }
        }
    })
})

wss.on("listening", () => console.log("Server is listening on port 8080."))