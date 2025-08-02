"use client"

import { useState, useEffect, useRef } from "react"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation" 

export default function RoomCanvas({ roomId, link }
    : {
        roomId: number,
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

        return () => {
            ws.close();
            setSocket(null);
            toast.error('Falied to connec to the server.')
        }
    }, [])

    return <div>
    </div>

}