import {Cloud, PanelLeft, Terminal, GitBranch, Command, Search, Play, Share, UserPlus} from "lucide-react";

export default function Navbar({isSaving, setIsCommandPaletteOpen, isSidebarVisible, setIsSidebarVisible, isConsoleOpen, setIsConsoleOpen}: {isSaving: boolean, setIsCommandPaletteOpen: (prev: boolean) => void, isSidebarVisible: boolean, setIsSidebarVisible: (prev: boolean) => void, isConsoleOpen: boolean, setIsConsoleOpen: (prev: boolean) => void}) {
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
                    <Search size={20} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-white transition-colors"/>
                    <div className="w-full bg-[#1e1e1e33] border border-transparent rounded-md py-1.5 pl-9 pr-4 text-sm outline-none text-zinc-300">
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

                <div className="w-8 h-8 rounded-full bg-[#D1D5DB] flex items-center justify-center text-[#4B5563]">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
            </div>
        </div>
        </nav>
    )
}