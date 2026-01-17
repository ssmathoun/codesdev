import { MoreVertical, Code2, ArrowRight } from "lucide-react";

// Example data structure if you need it for the parent component
const projects = [
  { id: 1, name: "collaborative-editor", lang: "TypeScript", updated: "2m ago" },
  { id: 2, name: "ai-action-recognition", lang: "Python", updated: "1h ago" },
  { id: 3, name: "portfolio-v3", lang: "Next.js", updated: "2d ago" },
];

interface ProjectCardProps {
    name: string;
    lang: string;
    updated: string;
}

export default function ProjectCard({ name, lang, updated }: ProjectCardProps) {
    return (
        <div className="group bg-[#1e1e1e] border border-white/5 rounded-xl p-5 hover:border-blue-500/50 hover:bg-[#252525] transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                    <Code2 size={24} />
                </div>
                <button className="text-zinc-500 hover:text-white transition-colors">
                    <MoreVertical size={18} />
                </button>
            </div>
            
            <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-blue-400 transition-colors">
                {name}
            </h3>
            
            <div className="flex items-center gap-3 text-xs text-zinc-500 font-medium">
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    {lang}
                </span>
                <span>•</span>
                <span>{updated}</span>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-zinc-400">
                <span className="text-[10px] uppercase tracking-wider font-bold">Open Project</span>
                <ArrowRight 
                    size={14} 
                    className="-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" 
                />
            </div>
        </div>
    );
}