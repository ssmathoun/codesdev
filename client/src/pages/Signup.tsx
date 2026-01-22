import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { authService } from "../services/auth";

export default function Signup() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await authService.register(formData);
      if (data) navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-ide-bg via-[#3a0505] to-ide-bg text-white font-sans flex flex-col items-center justify-center p-6 selection:bg-[#dc2626]">
      
      <div className="w-full max-w-100 bg-ide-bg border border-white/5 p-8 rounded-xl shadow-2xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-normal mb-2">codesdev</h1>
          <p className="text-zinc-400 text-sm font-normal leading-tight opacity-80">
            Initialize your collaborative workspace
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Security Password</label>
            <input 
              required
              type="password"
              className="bg-[#2A2A2A] border border-zinc-600 p-2.5 rounded text-white outline-none focus:border-ide-accent transition-all text-sm"
              placeholder="••••••••"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
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