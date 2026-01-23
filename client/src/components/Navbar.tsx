import {Cloud, PanelLeft, Terminal, GitBranch, Command, Search, Play, Share, UserPlus, User, LogOut, Settings, Save, History} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { NavbarProps } from "../types/types";
import { AVATAR_MAP } from "../constants/avatars";

export default function Navbar({ 
    user,
    projectId, 
    projectName, 
    isSaving, 
    setIsCommandPaletteOpen, 
    isSidebarVisible, 
    setIsSidebarVisible, 
    isConsoleOpen, 
    setIsConsoleOpen,
    onCheckpoint 
}: NavbarProps) {

    const navigate = useNavigate();

    // Helper to extract CSRF token from cookies
    const getCSRF = () => {
        const match = document.cookie.match(/csrf_access_token=([^;]+)/);
        return match ? decodeURIComponent(match[1]) : "";
    };

    const handleLogout = async () => {
        try {
            const res = await fetch(`http://localhost:5001/api/logout`, {
                method: "POST",
                headers: { 
                    "X-CSRF-TOKEN": getCSRF()
                },
                credentials: "include"
            });
    
            if (res.ok) {
                // Clear any local storage if necessary and redirect
                navigate("/login", { replace: true });
            }
        } catch (err) {
            console.error("Logout failed: System unreachable");
        }
    };

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
                {/* Action Icons */}
                <div className="flex items-center gap-4 mr-2">
                    {/* Opens the version naming modal */}
                    <button 
                        onClick={onCheckpoint}
                        title="Create Checkpoint (Snapshot)"
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded text-[10px] uppercase tracking-widest font-bold text-white/90 border border-white/5 transition-all active:scale-95"
                    >
                        <Save size={16} strokeWidth={2} />
                        <span className="hidden lg:block">Checkpoint</span>
                    </button>

                    <div className="h-4 w-px bg-white/10 mx-1" />

                    <Play size={20} fill="currentColor" className="hover:scale-110 cursor-pointer transition-transform text-white/90" />
                    <Share size={20} strokeWidth={1.5} className="hover:opacity-100 cursor-pointer transition-opacity opacity-80" />
                    <UserPlus size={20} strokeWidth={1.5} className="hover:opacity-100 cursor-pointer transition-opacity opacity-80" />
                </div>

                {/* Profile Avatar with Hover Menu */}
                <div className="relative group px-1">
                    {/* Avatar Trigger */}
                    <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer overflow-hidden transition-all group-hover:ring-2 group-hover:ring-white/30
                            ${user?.avatar_url 
                                ? 'bg-transparent border-none' 
                                : 'bg-zinc-900 border border-white/10'
                            }`}
                    >
                        {user?.avatar_url ? (
                            <img src={user.avatar_url} className="w-full h-full object-cover" alt="Profile" />
                        ) : user?.avatar_id ? (
                            <img src={AVATAR_MAP[user.avatar_id]} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-[11px] font-bold text-zinc-500">
                                {user?.username?.[0].toUpperCase()}
                            </span>
                        )}
                    </div>

                    {/* Hover Dropdown Menu */}
                    <div className="absolute right-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                        <div className="w-48 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-2xl overflow-hidden py-1">
                            <div className="px-4 py-2 border-b border-white/5 mb-1">
                                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Username</p>
                                <p className="text-sm text-white truncate">{user?.username || 'Dev'}</p>
                            </div>

                            <button 
                                onClick={() => navigate("/profile", { state: { from: projectId, name: projectName } })}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
                            >
                                <User size={14} className="text-zinc-500" /> View Profile
                            </button>

                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <LogOut size={14} /> Log Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}