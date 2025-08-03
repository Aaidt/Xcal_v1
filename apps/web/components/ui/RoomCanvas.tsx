"use client"

import { useState, useEffect, useRef } from "react"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation" 
import Canvas from "./Canvas"

export default function RoomCanvas({ roomId, link } : 
    {   roomId: number,
        link?: string
    }){
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const wsRef = useRef<WebSocket | null>(null);
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL as string;
    const router = useRouter();
    
    useEffect(() => {
        const token = localStorage.getItem("Authorization");
        if (!token) {
            toast.error('Login first!!')
            setLoading(false);
            router.push("/signin");
            return
        }

        if (!WS_URL) {
            console.log('No websocket url provided.')
            setLoading(false);
            return
        }

        const ws = new WebSocket(`${WS_URL}?token=${token}`)
        wsRef.current = ws
        setSocket(ws);

        console.log("Reached the ws server");
        ws.onerror = (e) => {
            toast.error('Falied to connect to the server.')
            console.log('Ws error: ' + JSON.stringify(e, ["message", "arguments", "type", "name"]))
            setLoading(false);
        }

        ws.onopen = () => {
            console.log("open")
            ws.send(JSON.stringify({
                type: "join_room",
                link: link
            }))
        }

        ws.onmessage = (event) => {
            console.log("message")

            try{
                const data = JSON.parse(event.data);
                if(data.status === "Success"){
                    setLoading(false);
                }
            }catch(err){
                console.log("Error is: " + err)
            }
        }

        ws.onclose = (e) => {
            console.log('Ws connection closed.' + JSON.stringify(e))
            toast.warn("Websocket connection closed")
            setLoading(false);
        }

        return () => {
            console.log("clean up func")
            ws.close();
            setSocket(null);
            toast.warn("You have left the room!")
        }
    }, [])

    if (!socket) {
        return <div className="bg-black/95 min-h-screen text-white text-lg flex justify-center items-center">
            Socket connection not established
        </div>
    }

    if (loading) {
        return <div className="bg-black/95 min-h-screen text-white text-lg flex justify-center items-center">
            Connecting to the server...
        </div>
    }

    return <Canvas socket={socket} roomId={roomId} />

}