import { useNavigate } from "react-router-dom";
import { Users, GitBranch, Terminal, ShieldCheck, Cpu, Globe, Github } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleStartCoding = () => {
    const roomId = Math.random().toString(36).substring(7);
    navigate(`/editor/${roomId}`);
  };

  return (
    <div className="relative min-h-screen w-full bg-ide-bg text-white font-sans flex flex-col selection:bg-ide-accent selection:text-white">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 sticky top-0 bg-ide-bg/80 backdrop-blur-xl z-50 border-b border-white/5">
        <div className="text-2xl font-normal">
          codesdev
        </div>
        <div className="flex gap-8 items-center font-normal">
          <button className="text-zinc-400 hover:text-white transition-colors text-sm">Login</button>
          <button className="bg-white text-black px-6 py-2 rounded-full font-normal hover:bg-ide-accent hover:text-white transition-all text-sm">
            Sign Up
          </button>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center pt-32 pb-48 px-4 bg-linear-to-b from-ide-bg via-[#3a0505] to-ide-bg">
          <h1 className="text-8xl md:text-9xl font-normal mb-6 text-center tracking-tighter">
            codesdev
          </h1>
          <p className="text-2xl md:text-3xl text-zinc-300 mb-14 text-center max-w-3xl font-normal leading-tight">
            A Real-Time Collaboration Coding Website for Developers
          </p>
          
          <button 
            onClick={handleStartCoding}
            className="px-14 py-6 bg-white text-black rounded-full font-normal text-2xl hover:bg-ide-accent hover:text-white hover:scale-105 transition-all shadow-2xl shadow-red-900/10 hover:shadow-red-600/50 active:scale-95 mb-10"
          >
            START CODING NOW
          </button>
          
          <p className="text-zinc-300 font-mono text-sm uppercase tracking-widest font-normal opacity-80">
            No installation required — browser based
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full mt-48 px-6">
            <FeatureCard 
              icon={<Users size={56} />} 
              title="Real-Time Collaboration" 
              description="Code together with your team in real-time with zero latency."
            />
            <FeatureCard 
              icon={<GitBranch size={56} />} 
              title="Visual Version Control" 
              description="Track changes and manage branches with an intuitive visual UI."
            />
            <FeatureCard 
              icon={<Terminal size={56} />} 
              title="Cloud Execution" 
              description="Run and test your code instantly on our secure cloud servers."
            />
          </div>
        </section>

        {/* Secondary Feature Section */}
        <section className="py-32 px-8 bg-black">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                <div>
                    <h2 className="text-5xl font-normal mb-8">Built for modern engineering teams.</h2>
                    <p className="text-zinc-400 text-lg leading-relaxed mb-8 font-normal">
                        Experience the power of a desktop IDE with the flexibility of the cloud. 
                        codesdev provides a high-performance environment with pre-configured 
                        toolchains for TypeScript, Python, and more.
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex items-center gap-3 text-sm font-normal uppercase tracking-widest text-zinc-300">
                            <ShieldCheck className="text-ide-accent" size={20}/> Enterprise Grade
                        </div>
                        <div className="flex items-center gap-3 text-sm font-normal uppercase tracking-widest text-zinc-300">
                            <Cpu className="text-ide-accent" size={20}/> Fast Compute
                        </div>
                    </div>
                </div>
                <div className="bg-zinc-900/50 aspect-video rounded-3xl border border-white/5 shadow-3xl flex items-center justify-center p-8 relative overflow-hidden">
                    <div className="absolute bg-ide-accent/20 w-62.5 h-62.5 blur-[120px] rounded-full"></div>
                    <Globe size={120} className="text-ide-accent/90 animate-pulse relative z-10" />
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-ide-bg border-t border-white/5 py-12 px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <span className="text-xl font-normal tracking-tight">codesdev</span>
            <span className="text-zinc-600 text-xs font-normal uppercase tracking-widest border-l border-white/10 pl-6 leading-none">
              © 2026 codesdev project
            </span>
          </div>

          <div className="flex items-center gap-10">
            <a href="https://github.com/ssmathoun/codesdev" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-normal">
              <Github size={18} /> GitHub
            </a>

            {/* Status: Glowing Amber for "Active Development" */}
            <span className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-500/80">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                Active Development
            </span>
            <span className="text-zinc-600 text-xs font-normal uppercase tracking-widest">V1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="border-2 border-white/10 rounded-3xl p-10 flex flex-col items-center text-center bg-white/5 backdrop-blur-sm hover:border-ide-accent/60 transition-all group cursor-default relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-t from-ide-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      <div className="mb-10 text-white group-hover:scale-110 group-hover:text-ide-accent transition-all duration-500 relative z-10">
        {icon}
      </div>
      <h3 className="text-2xl font-normal mb-4 relative z-10 tracking-tight">{title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed max-w-60 font-normal relative z-10">{description}</p>
    </div>
  );
}