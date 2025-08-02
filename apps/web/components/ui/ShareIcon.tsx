import { Share } from "lucide-react";
import { toast } from "react-toastify";

export function ShareIcon({hash} : {hash: string}){

    return <div>
        <Share onClick={() => {
            toast.success(`Share this link with your friends!!! ⚡${hash}⚡`)
        }} className="w-5 h-5 z-100" strokeWidth="1.5"  />
    </div>
}