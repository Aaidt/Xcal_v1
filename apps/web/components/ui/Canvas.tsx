"use client"

import { useState, useEffect, useRef } from "react"
import IconButton from "./IconButton"
import { Pencil, Circle, Square, Slash, Triangle, ArrowRight, MousePointer, Eraser } from "lucide-react"
import { Game } from "../../game/game"
import { toast } from "react-toastify"

export type Tool = "pencil" | "circle" | "rect" | "line" | "triangle" | "arrow" | "pointer" | "eraser"


export default function Canvas({
    socket,
    roomId
}: {
    socket: WebSocket,
    roomId: number
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [selectedTool, setSelectedTool] = useState<Tool>("pencil")
    const [game, setGame] = useState<Game>();

    const token = localStorage.getItem("Authorization");

    useEffect(() => {
        game?.setTool(selectedTool)
    }, [selectedTool, game])

    useEffect(() => {
        if(!token){
            toast.error('User not logged in.')
            return 
        }
        if (canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket, token);
            setGame(g)

            return () => {
                g.destroy()
            }
        }

    }, [canvasRef, roomId, socket, token])


    return <div className="min-h-screen overflow-hidden">
        <canvas width={window.innerWidth} height={window.innerHeight} ref={canvasRef} />
        <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
}


function Topbar({
    selectedTool,
    setSelectedTool
}: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void
}) {
    return (
        <div className="flex fixed top-5 left-1/2 -translate-x-1/2 z-50 p-2 border border-white/30 gap-2
        bg-gray-800 backdrop-blur-md rounded-lg">
            <IconButton icon={<MousePointer className="w-4 h-4" />}
                onClick={() => setSelectedTool("pointer")}
                activated={selectedTool === "pointer"} />

            <IconButton icon={<Pencil className="w-4 h-4" />}
                onClick={() => setSelectedTool("pencil")}
                activated={selectedTool === "pencil"} />

            <IconButton icon={<Circle className="w-4 h-4" />}
                onClick={() => setSelectedTool("circle")}
                activated={selectedTool === "circle"} />

            <IconButton icon={<Square className="w-4 h-4" />}
                onClick={() => setSelectedTool("rect")}
                activated={selectedTool === "rect"} />

            <IconButton icon={<Slash className="w-4 h-4" />}
                onClick={() => setSelectedTool("line")}
                activated={selectedTool === "line"} />

            <IconButton icon={<Triangle className="w-4 h-4" />}
                onClick={() => setSelectedTool("triangle")}
                activated={selectedTool === "triangle"} />

            <IconButton icon={<ArrowRight className="w-4 h-4" />}
                onClick={() => setSelectedTool("arrow")}
                activated={selectedTool === "arrow"} />

            <IconButton icon={<Eraser className="w-4 h-4" />}
                onClick={() => setSelectedTool("eraser")}
                activated={selectedTool === "eraser"} />

        </div>
    )
}