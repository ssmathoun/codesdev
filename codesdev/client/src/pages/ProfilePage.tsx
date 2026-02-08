import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, ChevronLeft, ShieldCheck, Camera, Save, User as UserIcon, ArrowLeft } from "lucide-react";
import { AVATAR_MAP } from "../constants/avatars";

export default function ProfilePage() {
    const navigate = useNavigate();
    const location = useLocation();

    const fromProjectId = location.state?.from;
    const fromProjectName = location.state?.name;
    
    const [user, setUser] = useState<{ 
        username: string; 
        email: string; 
        avatar_id?: string;
        avatar_url?: string; 
    } | null>(null);

    const [passwords, setPasswords] = useState({ old: "", new: "" });
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [stagedAvatar, setStagedAvatar] = useState<{ id?: string; url?: string } | null>(null);

    const API_BASE = "http://localhost:5001/api";

    // Helper for CSRF
    const getCSRF = () => {
        const match = document.cookie.match(/csrf_access_token=([^;]+)/);
        return match ? decodeURIComponent(match[1]) : "";
    };

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

    // Handle Preset Selection
    const handleAvatarChange = (id: string) => {
        setStagedAvatar({ id, url: undefined }); // Clear custom if picking preset
        setUser(prev => prev ? { ...prev, avatar_id: id, avatar_url: undefined } : null);
    };

    // Handle Custom Image Upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
    
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setStagedAvatar({ id: undefined, url: base64String }); // Clear preset if uploading custom
            setUser(prev => prev ? { ...prev, avatar_url: base64String, avatar_id: undefined } : null);
        };
        reader.readAsDataURL(file);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        setMessage({ text: "", type: "" });
    
        // Build the payload carefully
        const payload: any = {
            username: user?.username,
            email: user?.email,
        };
    
        // Handle Staged Avatar Changes
        if (stagedAvatar) {
            if (stagedAvatar.id) {
                payload.avatar_id = stagedAvatar.id;
                payload.avatar_url = null; // Clear custom if picking preset
            } else if (stagedAvatar.url) {
                payload.avatar_url = stagedAvatar.url;
                payload.avatar_id = null; // Clear preset if picking custom
            }
        }
    
        // Handle Optional Password
        if (passwords.new.trim() !== "") {
            if (!passwords.old) {
                setMessage({ text: "Current password required to change security key", type: "error" });
                setIsUpdating(false);
                return;
            }
            payload.old_password = passwords.old;
            payload.new_password = passwords.new;
        }
    
        try {
            const res = await fetch(`${API_BASE}/user/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.cookie.match(/csrf_access_token=([^;]+)/)?.[1] || ""
                },
                body: JSON.stringify(payload),
                credentials: "include"
            });
    
            if (res.ok) {
                setMessage({ text: "Identity synced successfully", type: "success" });
                setPasswords({ old: "", new: "" });
                setStagedAvatar(null);
            
                const freshUser = await fetch(`${API_BASE}/me`, { credentials: "include" });
                if (freshUser.ok) setUser(await freshUser.json());
                
            } else {
                const errorData = await res.json();
                setMessage({ text: errorData.msg || "Update failed", type: "error" });
            }
        } catch (err) {
            setMessage({ text: "Connection to Hub lost", type: "error" });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch(`${API_BASE}/logout`, {
                method: "POST",
                headers: { "X-CSRF-TOKEN": getCSRF() },
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
            
            <nav className="h-12 bg-[#dc2626] border-b border-black/10 flex items-center justify-between px-6 sticky top-0 z-50">
                {/* Left Side: Navigation Actions */}
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate("/home")} 
                        className="flex items-center gap-2 text-white/75 hover:text-white transition-colors text-xs font-normal"
                    >
                        <ChevronLeft size={14} /> Workspace
                    </button>
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

                {/* Right Side: Brand */}
                <div className="flex items-center gap-3">
                <Link 
                    to="/home" 
                    className="flex items-center gap-2 group transition-all active:scale-95"
                >
                    <h1 className="tracking-tight">codesdev</h1>
                </Link>
                </div>
            </nav>

            <main className="max-w-xl mx-auto pt-16 px-6 pb-24">
                <header className="flex flex-col items-center mb-16">
                    <div className="relative mb-6 group">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl text-zinc-400 font-normal overflow-hidden shadow-xl transition-all
                        ${user?.avatar_url ? 'bg-transparent border-none' : 'bg-zinc-900 border border-white/5'}`}>
                        {user?.avatar_url ? (
                            <img src={user.avatar_url} className="w-full h-full object-cover" alt="Custom Profile" />
                        ) : user?.avatar_id ? (
                            <img src={AVATAR_MAP[user.avatar_id]} className="w-full h-full object-cover" alt="Preset Profile" />
                        ) : (
                            user?.username?.[0].toUpperCase()
                        )}
                    </div>
                        
                        {/* Camera Overlay for Upload */}
                        <label className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera size={20} className="mb-1" />
                            <span className="text-[8px] uppercase tracking-widest">Upload</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                    </div>

                    {/* Presets Grid */}
                    <div className="flex gap-3 mb-8">
                        {Object.keys(AVATAR_MAP).map((id) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => handleAvatarChange(id)}
                                className={`w-8 h-8 rounded-full border-2 transition-all overflow-hidden p-0.5 bg-zinc-900 ${
                                    user?.avatar_id === id && !user?.avatar_url
                                        ? "border-[#dc2626] scale-110 shadow-lg shadow-[#dc2626]/20" 
                                        : "border-transparent opacity-40 hover:opacity-100"
                                }`}
                            >
                                <img src={AVATAR_MAP[id]} alt={id} className="w-full h-full rounded-full" />
                            </button>
                        ))}
                    </div>

                    <h2 className="text-2xl text-zinc-100 tracking-tight font-normal">{user?.username}</h2>
                </header>

                <form onSubmit={handleUpdate} className="space-y-12">
                    {message.text && (
                        <div className={`p-3 rounded text-[11px] tracking-widest uppercase border ${
                            message.type === 'success' ? 'bg-green-500/5 border-green-500/20 text-green-500' : 'bg-red-500/5 border-red-500/20 text-red-500'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-2 font-normal">
                           <UserIcon size={12} /> General
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] text-zinc-600 uppercase tracking-widest ml-1 font-normal">Username</label>
                            <input type="text" value={user?.username || ""} onChange={(e) => setUser(prev => prev ? {...prev, username: e.target.value} : null)} className="w-full bg-white/5 border border-white/5 p-3 rounded outline-none focus:border-[#dc2626]/30 transition-all text-sm text-zinc-300 font-normal" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] text-zinc-600 uppercase tracking-widest ml-1 font-normal">Email</label>
                            <input type="email" value={user?.email || ""} onChange={(e) => setUser(prev => prev ? {...prev, email: e.target.value} : null)} className="w-full bg-white/5 border border-white/5 p-3 rounded outline-none focus:border-[#dc2626]/30 transition-all text-sm text-zinc-300 font-normal" />
                        </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-white/5">
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-2 font-normal">
                            <ShieldCheck size={12} /> Security
                        </div>
                        <div className="grid gap-4">
                            <input type="password" placeholder="Current Password" value={passwords.old} onChange={(e) => setPasswords({...passwords, old: e.target.value})} className="w-full bg-white/5 border border-white/5 p-3 rounded outline-none focus:border-[#dc2626]/30 transition-all text-sm placeholder:text-zinc-800 font-normal" />
                            <input type="password" placeholder="New Password" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} className="w-full bg-white/5 border border-white/5 p-3 rounded outline-none focus:border-[#dc2626]/30 transition-all text-sm placeholder:text-zinc-800 font-normal" />
                        </div>
                    </div>

                    <div className="pt-6 flex flex-col gap-4">
                        <button type="submit" disabled={isUpdating} className="w-full bg-[#dc2626]/90 hover:bg-[#dc2626] disabled:opacity-30 text-white text-[11px] font-normal tracking-[0.2em] py-3.5 rounded transition-all flex items-center justify-center gap-2">
                            <Save size={14} /> {isUpdating ? "SYNCING..." : "SAVE CHANGES"}
                        </button>
                        <button type="button" onClick={handleLogout} className="w-full border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 text-[10px] py-3.5 rounded transition-all flex items-center justify-center gap-2 tracking-[0.2em] uppercase font-normal">
                            <LogOut size={13} /> Log Out
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}