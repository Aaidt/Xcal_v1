export default function IconButton({
    icon,
    onClick,
    activated
}: {
    icon: React.ReactNode,
    onClick: () => void,
    activated: boolean
}) {
    return <div className={`rounded-md px-2 py-2 hover:bg-gray-800 duration-200 cursor-pointer
        ${activated ? "bg-[#413e6b]" : "text-white"}`} onClick={onClick}>
            {icon}
    </div>

}