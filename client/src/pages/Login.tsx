import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, ShieldCheck } from "lucide-react";
import { authService } from "../services/auth";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const isSuccess = await login(formData);
      
      if (isSuccess) {
        setTimeout(() => {
          navigate("/home", { replace: true });
        }, 100);
      } else {
        alert("Verification failed. Please try again.");
      }
    } catch (err) {
      alert("System error. Check connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-ide-bg via-[#3a0505] to-ide-bg text-white font-sans flex flex-col items-center justify-center p-6">
      
      <div className="w-full max-w-100 bg-ide-bg border border-white/5 p-8 rounded-xl shadow-2xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-normal mb-2">codesdev</h1>
          <p className="text-zinc-400 text-sm font-normal leading-tight opacity-80">
            Authorized access to development environment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-widest">Email</label>
            <input 
              required
              type="email"
              className="bg-[#2A2A2A] border border-zinc-600 p-2.5 rounded text-white outline-none focus:border-ide-accent transition-all text-sm"
              placeholder="name@codesdev.io"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-widest">Password</label>
            <input 
              required
              type="password"
              className="bg-[#2A2A2A] border border-zinc-600 p-2.5 rounded text-white outline-none focus:border-ide-accent transition-all text-sm"
              placeholder="••••••••"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button className="mt-2 flex items-center justify-center gap-2 bg-[#DC26268e] hover:bg-ide-accent text-white px-4 py-3 rounded transition-all font-medium text-sm">
            Authenticate <LogIn size={18} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
          <Link to="/signup" className="text-zinc-400 hover:text-white text-xs transition-colors">
            Request credentials? <span className="text-ide-accent font-medium ml-1">Sign up</span>
          </Link>
          <div className="flex items-center gap-2 text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
            <ShieldCheck size={14} className="text-zinc-700" /> Secure Session Logic
          </div>
        </div>
      </div>
    </div>
  );
}