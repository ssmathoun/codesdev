import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Camera, Trash2, EyeOff, Eye } from "lucide-react";
import { authService } from "../services/auth";
import { AVATAR_MAP } from "../constants/avatars";

export default function Signup() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState("default");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const registrationData = {
        ...formData,
        avatar_id: customAvatar ? null : selectedPreset,
        avatar_url: customAvatar || null
      };

      const data = await authService.register(registrationData);
      if (data) navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomAvatar(reader.result as string);
        setSelectedPreset(""); 
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-ide-bg via-[#3a0505] to-ide-bg text-white font-sans flex flex-col items-center justify-center p-6 selection:bg-[#dc2626]">
      
      <div className="w-full max-w-100 bg-ide-bg border border-white/5 p-8 rounded-xl shadow-2xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-normal mb-2 tracking-tighter">codesdev</h1>
          <p className="text-zinc-400 text-sm font-normal leading-tight opacity-80">
            Initialize your collaborative workspace
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Identity Selection Section */}
          <div className="flex flex-col items-center gap-4 mb-2">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden">
                {customAvatar ? (
                  <img src={customAvatar} className="w-full h-full object-cover" alt="Custom Preview" />
                ) : (
                  <img src={AVATAR_MAP[selectedPreset || "default"]} className="w-full h-full object-cover" alt="Preset Preview" />
                )}
              </div>
              
              <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera size={18} />
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>

              {customAvatar && (
                <button 
                  type="button"
                  onClick={() => {setCustomAvatar(null); setSelectedPreset("default");}}
                  className="absolute -top-1 -right-1 bg-zinc-800 p-1 rounded-full border border-white/10 text-zinc-400 hover:text-white"
                >
                  <Trash2 size={10} />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              {Object.keys(AVATAR_MAP).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => { setSelectedPreset(id); setCustomAvatar(null); }}
                  className={`w-8 h-8 rounded-full border-2 transition-all overflow-hidden p-0.5 bg-zinc-900 ${
                    selectedPreset === id && !customAvatar ? "border-[#dc2626] scale-110" : "border-transparent opacity-40 hover:opacity-100"
                  }`}
                >
                  <img src={AVATAR_MAP[id]} className="w-full h-full rounded-full" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">System Username</label>
              <input 
                required
                className="bg-[#2A2A2A] border border-zinc-600 p-2.5 rounded text-white outline-none focus:border-ide-accent transition-all text-sm"
                placeholder="dev_commander"
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                required
                type="email"
                className="bg-[#2A2A2A] border border-zinc-600 p-2.5 rounded text-white outline-none focus:border-ide-accent transition-all text-sm"
                placeholder="access@codesdev.io"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                Security Password
              </label>
              <div className="relative">
                <input 
                  required
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-[#2A2A2A] border border-zinc-600 p-2.5 rounded text-white outline-none focus:border-ide-accent transition-all text-sm pr-10"
                  placeholder="••••••••"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <button className="mt-4 flex items-center justify-center gap-2 bg-[#DC26268e] hover:bg-ide-accent text-white px-4 py-3 rounded transition-all font-medium text-sm">
              Initialize Account <UserPlus size={18} />
          </button>

        </form>

        <p className="mt-8 text-center text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold">
          Already registered? <Link to="/login" className="text-white hover:text-ide-accent transition-colors ml-1">Login</Link>
        </p>
      </div>
    </div>
  );
}