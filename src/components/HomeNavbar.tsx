import { Search, Plus, LayoutGrid, Clock, Star } from "lucide-react";

export default function HomeNavbar() {
    return (
        <nav className="flex items-center justify-between px-4 w-full h-14 bg-ide-accent text-white select-none border-b border-white/5">
            
            {/* Left: Branding and Dashboard Navigation */}
            <div className="flex items-center gap-8 flex-1 justify-start">
                <h1 className="tracking-tight font-bold text-xl cursor-pointer">codesdev</h1>
                
                <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-400">
                    <div className="flex items-center gap-2 text-white border-b-2 border-white py-4 translate-y-[2px] cursor-pointer">
                        <LayoutGrid size={16} />
                        <span>Projects</span>
                    </div>
                    <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer py-4">
                        <Clock size={16} />
                        <span>Recent</span>
                    </div>
                    <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer py-4">
                        <Star size={16} />
                        <span>Favorites</span>
                    </div>
                </div>
            </div>

            {/* Center: Global Search (Identical styling to Editor) */}
            <div className="flex flex-1 justify-center max-w-2xl px-8">
                <div className="relative group w-full">
                    <Search size={18} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors"/>
                    <input 
                        type="text"
                        placeholder="Search your projects..."
                        className="w-full bg-[#1e1e1e33] border border-transparent rounded-md py-1.5 pl-10 pr-4 text-sm outline-none focus:bg-[#1e1e1e66] focus:border-white/10 text-zinc-300 placeholder:text-zinc-500 transition-all"
                    />
                </div>
            </div>

            {/* Right: User Section (Identical to Editor) */}
            <div className="flex items-center gap-4 flex-1 justify-end">
                <button className="hidden sm:flex items-center gap-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md transition-colors mr-2">
                    <Plus size={16} strokeWidth={3} />
                    New Project
                </button>

                {/* Avatar Stack - Match Editor logic */}
                <div className="flex -space-x-2">
                    <img src="https://i.pravatar.cc/32?img=1" className="w-8 h-8 rounded-full border-2 border-ide-accent" alt="Team member" />
                    <img src="https://i.pravatar.cc/32?img=2" className="w-8 h-8 rounded-full border-2 border-ide-accent" alt="Team member" />
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800 text-[10px] font-bold border-2 border-ide-accent">
                        +1
                    </div>
                </div>

                {/* Profile Logo - Match Editor logic */}
                <div className="w-8 h-8 rounded-full bg-[#D1D5DB] flex items-center justify-center text-[#4B5563] cursor-pointer hover:opacity-90 transition-opacity">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                </div>
            </div>
        </nav>
    );
}