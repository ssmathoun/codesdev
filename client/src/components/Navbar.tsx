import {Cloud, PanelLeft, Terminal, GitBranch, Command, Search, Play, Share, UserPlus, User} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { NavbarProps } from "../types/types";

export default function Navbar({ 
    projectId, 
    projectName, 
    isSaving, 
    setIsCommandPaletteOpen, 
    isSidebarVisible, 
    setIsSidebarVisible, 
    isConsoleOpen, 
    setIsConsoleOpen 
}: NavbarProps) {
    
    const navigate = useNavigate();

    return (
        <nav className="flex items-center justify-between px-4 w-full h-full bg-ide-accent text-white select-none">

            <div className="flex items-center gap-4 flex-1 justify-start">
                <h1 className="tracking-tight">codesdev</h1>

                {isSaving ?
                <div className="flex items-center gap-2 opacity-100 cursor-pointer transition-opacity ml-4">
                    <Cloud size={24} strokeWidth={1.5} />
                    <span className="text-sm">saving...</span>
                </div>
                : null}

                <div className="flex items-center gap-4 ml-4">
                    <button 
                        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
                        className={`cursor-pointer transition-opacity border-b-2 py-1 ${isSidebarVisible ? "border-b-white opacity-100" : "border-b-transparent opacity-80 hover:opacity-100"}`}
                        title="Toggle Sidebar (Ctrl+B)"
                    >
                        <PanelLeft size={24} strokeWidth={1.5} />
                    </button>
                    <button 
                        onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                        className={`cursor-pointer transition-opacity border-b-2 py-1 ${isConsoleOpen ? "border-b-white opacity-100" : "border-b-transparent opacity-80 hover:opacity-100"}`}
                        title="Toggle Console (Ctrl+J)"
                    >
                        <Terminal size={24} strokeWidth={1.5} />
                    </button>
                    <GitBranch size={24} strokeWidth={1.5} className="hover:opacity-100 opacity-80 cursor-pointer transition-opacity"/>
                    <Command size={24} strokeWidth={1.5} className="hover:opacity-100 opacity-80 cursor-pointer transition-opacity"/>
                </div>
            </div>

            <div className="flex flex-1 justify-center max-w-2xl px-8">
                <div 
                    className="relative group w-full"
                    onClick={() => setIsCommandPaletteOpen(true)}
                >
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors"/>
                    <div className="w-full bg-[#1e1e1e33] border border-transparent rounded-md py-1.5 pl-9 pr-4 text-sm outline-none text-white/50">
                        Search files... 
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 flex-1 justify-end">
                <div className="flex items-center gap-4">
                    <Play size={20} fill="currentColor" className="hover:scale-110 cursor-pointer transition-transform"/>
                    <Share size={20} strokeWidth={1.5} className="hover:opacity-100 cursor-pointer transition-opacity opacity-80"/>
                    <UserPlus size={20} strokeWidth={1.5} className="hover:opacity-100 cursor-pointer transition-opacity opacity-80"/>
                </div>

                <div className="flex -space-x-2">
                    <img src="https://i.pravatar.cc/32?img=1" className="w-8 h-8 rounded-full border-2 border-ide-accent" />
                    <img src="https://i.pravatar.cc/32?img=2" className="w-8 h-8 rounded-full border-2 border-ide-accent" />
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800 text-[10px] font-bold border-2 border-ide-accent">
                        +1
                    </div>
                </div>

                <div 
                    onClick={() => navigate("/profile", { 
                        state: { from: projectId, name: projectName } 
                    })}
                    className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center cursor-pointer transition-all border border-white/10"
                >
                    <User size={16} />
                </div>
        </div>
        </nav>
    )
}