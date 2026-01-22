import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, ChevronLeft, ShieldCheck, Camera, Save, User as UserIcon, ArrowLeft } from "lucide-react";

export default function ProfilePage() {
    const navigate = useNavigate();
    const location = useLocation();

    // Catch the data sent from Navbar
    const fromProjectId = location.state?.from;
    const fromProjectName = location.state?.name;
    
    const [user, setUser] = useState<{ username: string; email: string } | null>(null);
    const [passwords, setPasswords] = useState({ old: "", new: "" });
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const API_BASE = "http://localhost:5001/api";

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${API_BASE}/me`, { credentials: "include" });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                } else {
                    navigate("/login");
                }
            } catch (err) {
                console.error("Identity fetch failed:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, [navigate]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        setMessage({ text: "", type: "" });

        try {
            const res = await fetch(`${API_BASE}/user/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.cookie.match(/csrf_access_token=([^;]+)/)?.[1] || ""
                },
                body: JSON.stringify({
                    username: user?.username,
                    email: user?.email,
                    old_password: passwords.old,
                    new_password: passwords.new
                }),
                credentials: "include"
            });

            const data = await res.json();
            if (res.ok) {
                setMessage({ text: "Profile updated successfully", type: "success" });
                setPasswords({ old: "", new: "" });
            } else {
                setMessage({ text: data.msg || "Update failed", type: "error" });
            }
        } catch (err) {
            setMessage({ text: "Connection error", type: "error" });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch(`${API_BASE}/logout`, {
                method: "POST",
                headers: { "X-CSRF-TOKEN": document.cookie.match(/csrf_access_token=([^;]+)/)?.[1] || "" },
                credentials: "include"
            });
            navigate("/login");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    if (isLoading) return (
        <div className="h-screen bg-[#050505] flex items-center justify-center">
            <div className="w-5 h-5 border border-[#dc2626] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white font-normal selection:bg-[#dc2626] selection:text-white" style={{ fontFamily: '"Inter", sans-serif' }}>
            
            {/* Branded Crimson Navbar */}
            <nav className="h-12 bg-[#dc2626] border-b border-black/10 flex items-center px-6 sticky top-0 z-50">
            <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate("/home")} 
                        className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs font-normal"
                    >
                        <ChevronLeft size={14} />
                         Workspace
                    </button>
                    
                    {/* Only show "Return to Editor" if the user actually came from one */}
                    {fromProjectId && (
                        <>
                            <div className="h-3 w-px bg-white/20" />
                            <button 
                                onClick={() => navigate(`/editor/${fromProjectId}`)} 
                                className="flex items-center gap-2 text-white hover:text-white transition-colors text-xs font-normal"
                            >
                                <ArrowLeft size={14} /> Back to {fromProjectName || 'Editor'}
                            </button>
                        </>
                    )}
                </div>
                
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
                    <span className="text-[13px] tracking-tight text-white opacity-90 font-normal">codesdev</span>
                </div>
            </nav>

            <main className="max-w-xl mx-auto pt-16 px-6 pb-24">
                
                {/* Identity (Avatar and Name) */}
                <header className="flex flex-col items-center mb-16">
                    <div className="relative group mb-4">
                        <div className="w-24 h-24 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-3xl text-zinc-400 font-normal">
                            {user?.username?.[0].toUpperCase()}
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera size={20} />
                        </div>
                    </div>
                    <h2 className="text-2xl text-zinc-100 tracking-tight font-normal">{user?.username}</h2>
                </header>

                <form onSubmit={handleUpdate} className="space-y-12">
                    
                    {/* Status Feedback */}
                    {message.text && (
                        <div className={`p-3 rounded text-[11px] tracking-widest uppercase border ${
                            message.type === 'success' ? 'bg-green-500/5 border-green-500/20 text-green-500' : 'bg-red-500/5 border-red-500/20 text-red-500'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    {/* General Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-2">
                           <UserIcon size={12} /> General
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-[10px] text-zinc-600 uppercase tracking-widest ml-1">Username</label>
                            <input 
                                type="text"
                                value={user?.username || ""}
                                onChange={(e) => setUser(prev => prev ? {...prev, username: e.target.value} : null)}
                                className="w-full bg-white/3 border border-white/5 p-3 rounded outline-none focus:border-[#dc2626]/30 transition-all text-sm text-zinc-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] text-zinc-600 uppercase tracking-widest ml-1">Email</label>
                            <input 
                                type="email"
                                value={user?.email || ""}
                                onChange={(e) => setUser(prev => prev ? {...prev, email: e.target.value} : null)}
                                className="w-full bg-white/3 border border-white/5 p-3 rounded outline-none focus:border-[#dc2626]/30 transition-all text-sm text-zinc-300"
                            />
                        </div>
                    </div>

                    {/* Security Section */}
                    <div className="space-y-6 pt-6 border-t border-white/5">
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-2">
                            <ShieldCheck size={12} /> Security
                        </div>
                        
                        <div className="grid gap-4">
                            <input 
                                type="password"
                                placeholder="Current Password"
                                value={passwords.old}
                                onChange={(e) => setPasswords({...passwords, old: e.target.value})}
                                className="w-full bg-white/3 border border-white/5 p-3 rounded outline-none focus:border-[#dc2626]/30 transition-all text-sm placeholder:text-zinc-800"
                            />
                            <input 
                                type="password"
                                placeholder="New Password"
                                value={passwords.new}
                                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                className="w-full bg-white/3 border border-white/5 p-3 rounded outline-none focus:border-[#dc2626]/30 transition-all text-sm placeholder:text-zinc-800"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 flex flex-col gap-4">
                        <button 
                            type="submit"
                            disabled={isUpdating}
                            className="w-full bg-[#dc2626]/90 hover:bg-[#dc2626] disabled:opacity-30 text-white text-[11px] font-normal tracking-[0.2em] py-3.5 rounded transition-all flex items-center justify-center gap-2"
                        >
                            <Save size={14} /> {isUpdating ? "SYNCING..." : "SAVE CHANGES"}
                        </button>
                        
                        <button 
                            type="button"
                            onClick={handleLogout}
                            className="w-full border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 text-[10px] py-3.5 rounded transition-all flex items-center justify-center gap-2 tracking-[0.2em] uppercase"
                        >
                            <LogOut size={13} /> Log Out
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}