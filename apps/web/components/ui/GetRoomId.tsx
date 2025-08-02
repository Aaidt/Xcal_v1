"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import RoomCanvas from "./RoomCanvas"
import { toast } from "react-toastify"
import { useRouter } from 'next/navigation' 

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface axiosResponse {
    roomId: number
}

export default function GetRoomId({ slug }: { slug: string }) {

    const [roomId, setRoomId] = useState<number | null>()
    const [loading, setLoading] = useState<boolean>(true)
    const router = useRouter();


    useEffect(() => {
        async function fetchRoomId() {
            try {
                if (!BACKEND_URL) {
                    console.log('BACKEND_URL is not defined');
                    setLoading(false)
                    return;
                }
                const token = localStorage.getItem('Authorization');

                if (!token) {
                    toast.error('Authorization token not found');
                    setLoading(false)
                    router.push('/signin');
                    return;
                }

                const response = await axios.get<axiosResponse>(`${BACKEND_URL}/api/room/${slug}`, {
                    headers: { "Authorization": token }
                })
                setRoomId(response?.data.roomId)
                toast.success('Room loaded Successfully!!!')
            } catch (err) {
                toast.error('An unexpected error occured...')
                console.error(err)
            }finally{
                setLoading(false)
            }
        }

        fetchRoomId()
    }, [slug, router]);

    if(loading){
        return (
            <div className="flex text-lg text-white justify-center items-center bg-black/95 min-h-screen">
                Loading....
            </div>    
        )
    }

    if(!roomId){
        return (
            <div className="flex text-lg text-white justify-center items-center bg-black/95 min-h-screen">
                No room found with that name.
            </div>    
        )
    }

    return <RoomCanvas roomId={roomId} />
}