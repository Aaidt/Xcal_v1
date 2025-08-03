export default function IconButton({
    icon,
    onClick,
    activated
}: {
    icon: React.ReactNode,
    onClick: () => void,
    activated: boolean
}) {
    return <div className={`rounded-md px-3 py-3 hover:bg-white/10 duration-200 cursor-pointer
        ${activated ? "bg-[#413e6b]" : "text-white"}`} onClick={onClick}>
            {icon}
    </div>

}