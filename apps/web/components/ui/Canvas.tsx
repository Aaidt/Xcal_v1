"use client"

import { useState, useEffect, useRef } from "react"
import IconButton from "./IconButton"
import { Pencil, Circle, Square, Minus, MoveRight, MousePointer, Eraser } from "lucide-react"
import { Game } from "../../game/game"
import { toast } from "react-toastify"

export type Tool = "pencil" | "circle" | "rect" | "line" | "arrow" | "pointer" | "eraser"


export default function Canvas({
    socket,
    roomId
}: {
    socket: WebSocket,
    roomId: string
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
        <div>
            <div className="flex fixed top-5 left-1/2 -translate-x-1/2 z-50 px-1 py-1 bg-[#232329] gap-2
                backdrop-blur-md rounded-lg">
                <IconButton icon={<MousePointer className="size-3.5" fill={`${selectedTool == "pointer"? "white" : "#232329"}`} strokeWidth="1.5" />}
                    onClick={() => setSelectedTool("pointer")}
                    activated={selectedTool === "pointer"} />

                <IconButton icon={<Pencil className="size-3.5" strokeWidth="1.5" />}
                    onClick={() => setSelectedTool("pencil")}
                    activated={selectedTool === "pencil"} />

                <IconButton icon={<Circle className="size-3.5" fill={`${selectedTool == "circle" ? "white" : "#232329"}`} strokeWidth="1.5" />}
                    onClick={() => setSelectedTool("circle")}
                    activated={selectedTool === "circle"} />

                <IconButton icon={<Square className="size-3.5" fill={`${selectedTool == "rect" ? "white" : "#232329"}`} strokeWidth="1.5" />}
                    onClick={() => setSelectedTool("rect")}
                    activated={selectedTool === "rect"} />

                <IconButton icon={<Minus className="size-3.5" fill={`${selectedTool == "line" ? "white" : "#232329"}`} strokeWidth="1.5" />}
                    onClick={() => setSelectedTool("line")}
                    activated={selectedTool === "line"} />

                <IconButton icon={<MoveRight className="size-3.5" fill={`${selectedTool == "arrow" ? "white" : "#232329"}`} strokeWidth="1.5" />}
                    onClick={() => setSelectedTool("arrow")}
                    activated={selectedTool === "arrow"} />

                <IconButton icon={<Eraser className="size-3.5" fill={`${selectedTool == "eraser" ? "white" : "#232329"}`} strokeWidth="1.5" />}
                    onClick={() => setSelectedTool("eraser")}
                    activated={selectedTool === "eraser"} />
            </div>
            <button onClick={() => {

            }} className="bg-[#a9a4ff] rounded-md px-3 py-2 text-black cursor-pointer hover:bg-[#a9a4ff]/90 text-sm
                fixed top-0 right-0 m-6">
                Share
            </button>
        </div>
    )
}