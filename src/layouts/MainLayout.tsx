import { useState } from "react";
import CodeEditor from "../components/CodeEditor"
import FileSidebar from "../components/FileSidebar"

export default function MainLayout() {
    const [sidebarWidth, setSidebarWidth] = useState("20"); // Tracks FileSidebar Width
    
    /*
    Function to resize the sidebar on mouse down event.
    */
    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        const startX = event.clientX;
        const startSidebarWidth = parseInt(sidebarWidth, 10);

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const newWidth = (moveEvent.clientX / window.innerWidth) * 100;
            setSidebarWidth(newWidth.toString())
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

    };

    return (
        <>
            <div className="grid grid-rows-[48px_1fr] h-screen w-full">

                {/* Top Navbar */}
                <nav className="flex bg-[#DC2626] text-white"></nav>

                <div className="h-full flex">
                    <FileSidebar width={sidebarWidth} />

                    {/* Resize Gutter */}
                    <div className="w-1 h-screen bg-[#1e1e1e] active:bg-blue-500 cursor-col-resize"
                            onMouseDown={handleMouseDown}></div>
                            
                    <div className="flex-1">
                        <CodeEditor />
                    </div>

                </div>
            </div>
        </>
    )
}