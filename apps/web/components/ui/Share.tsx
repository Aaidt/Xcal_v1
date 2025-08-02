import { Share2 } from "lucide-react";
import { toast } from "react-toastify";

export function Share({hash} : {hash: string}){

    return <div>
        <Share2 onClick={() => {
            toast.success(`Share this link with your friends!!! ⚡${hash}⚡`)
        }} className="w-4 h-4" strokeWidth="1.5"  />
    </div>
}