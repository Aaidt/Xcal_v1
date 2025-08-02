"use client"

import { useState, useEffect, useRef } from "react"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation" 

export default function RoomCanvas({ roomId, link } : 
    {   roomId: number,
        link?: string
    }){
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const wsRef = useRef<WebSocket | null>(null);
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL as string;
    const token = localStorage.getItem("Authorization");
    const router = useRouter();

    useEffect(() => {
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

        ws.onerror = (e) => {
            toast.error('Falied to connec to the server.')
            console.log('Ws error ' + JSON.stringify(e))
            setLoading(false);
        }

        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: "join_room",
                link: link
            }))
        }

        ws.onmessage = (event) => {
            try{
                const data = JSON.parse(event.data);
                if(data.success === "true"){
                    setLoading(false);
                }
            }catch(err){
                console.log("Error is: " + err)
            }
        }

        ws.onclose = () => {
            console.log('Ws connection closed.')
            toast.warn("websocket connection closed")
            setLoading(false);
        }

        return () => {
            ws.close();
            setSocket(null);
            toast.error('Falied to connec to the server.')
        }
    }, [roomId, WS_URL, router, token, link])

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

    return 

}