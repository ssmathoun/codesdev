import {Cloud, GitBranch, Command, Search, Play, Share, UserPlus} from "lucide-react";

export default function Navbar({isSaving}: {isSaving: boolean}) {
    return (
        <nav className="flex items-center justify-between px-4 w-full h-full bg-[#DC2626] text-white select-none">

            <div className="flex items-center gap-4 flex-1 justify-start">
                <h1 className="tracking-tight">codesdev</h1>

                {isSaving ?
                <div className="flex items-center gap-2 opacity-100 cursor-pointer transition-opacity ml-4">
                    <Cloud size={24} strokeWidth={1.5} />
                    <span className="text-sm">saving...</span>
                </div>
                : null}

                <div className="flex items-center gap-4 opacity-80 ml-4">
                    <GitBranch size={24} strokeWidth={1.5} className="hover:opacity-100 cursor-pointer transition-opacity"/>
                    <Command size={24} strokeWidth={1.5} className="hover:opacity-100 cursor-pointer transition-opacity"/>
                </div>
            </div>

            <div className="flex flex-1 justify-center max-w-2xl px-8">
                <div className="relative group w-full">
                    <Search size={20} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-white transition-colors"/>
                    <input 
                        type="text" 
                        placeholder="Search files, commands, etc..." 
                        className="w-full bg-[#1e1e1e33] border border-transparent focus:bg-[#1e1e1e66] focus:border-zinc-500 rounded-md py-1.5 pl-9 pr-4 text-sm outline-none transition-all placeholder:text-zinc-300"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 flex-1 justify-end">
                <div className="flex items-center gap-4">
                    <Play size={20} fill="currentColor" className="hover:scale-110 cursor-pointer transition-transform"/>
                    <Share size={20} strokeWidth={1.5} className="hover:opacity-100 cursor-pointer transition-opacity opacity-80"/>
                    <UserPlus size={20} strokeWidth={1.5} className="hover:opacity-100 cursor-pointer transition-opacity opacity-80"/>
                </div>

                <div className="flex -space-x-2">
                    <img src="https://i.pravatar.cc/32?img=1" className="w-8 h-8 rounded-full border-2 border-[#DC2626]" />
                    <img src="https://i.pravatar.cc/32?img=2" className="w-8 h-8 rounded-full border-2 border-[#DC2626]" />
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800 text-[10px] font-bold border-2 border-[#DC2626]">
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