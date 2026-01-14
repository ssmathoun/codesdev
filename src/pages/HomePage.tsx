import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, Search, LayoutGrid, User, Users, 
  Share2, Clock, Folder, ChevronRight, Menu, X 
} from "lucide-react";
import Modal from "../components/Modal";

type Category = "all" | "mine" | "shared" | "collaborative";

export default function HomePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const projects = [
    { id: "p1-992", name: "auth-service-v3", owner: "You", updated: "10m ago", type: "mine" },
    { id: "p2-114", name: "distributed-crawler", owner: "Alex Rivera", updated: "4h ago", type: "shared" },
    { id: "p3-005", name: "codesdev-marketing", owner: "Dev Team", updated: "Yesterday", type: "collaborative" },
    { id: "p4-882", name: "rust-wasm-bridge", owner: "You", updated: "2 days ago", type: "mine" },
  ];

  const filteredProjects = projects.filter(p => {
    const matchesTab = activeTab === "all" || p.type === activeTab;
    return matchesTab && p.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    const roomId = Math.random().toString(36).substring(7);
    navigate(`/editor/${roomId}`, { state: { projectName: newProjectName } });
  };

  return (
    <div className="min-h-screen w-full bg-ide-bg text-white font-sans flex flex-col md:flex-row selection:bg-ide-accent selection:text-white overflow-x-hidden">
      
      {/* Sidebar - Consistent with Editor Sidebar Utility */}
      <aside className={`
        fixed inset-0 z-40 md:relative md:flex md:w-64 border-r border-white/5 bg-ide-bg flex-col transition-transform duration-300
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* codesdev Brand Header */}
        <div className="flex items-center h-[48px] px-6 border-b border-white/5 text-lg font-normal tracking-tighter text-white">
          codesdev
        </div>
        
        {/* Category Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
        <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center gap-3 text-zinc-500 hover:bg-ide-accent/10 hover:text-ide-accent px-3 py-2 rounded-md transition-all text-[13px] font-normal"
          >
            <Plus size={16} strokeWidth={2}/>
            New Project
          </button>
          <SidebarBtn icon={<LayoutGrid size={16} />} label="All Projects" active={activeTab === "all"} onClick={() => {setActiveTab("all"); setIsMobileMenuOpen(false);}} />
          <SidebarBtn icon={<User size={16} />} label="My Projects" active={activeTab === "mine"} onClick={() => {setActiveTab("mine"); setIsMobileMenuOpen(false);}} />
          <SidebarBtn icon={<Share2 size={16} />} label="Shared" active={activeTab === "shared"} onClick={() => {setActiveTab("shared"); setIsMobileMenuOpen(false);}} />
          <SidebarBtn icon={<Users size={16} />} label="Collaborative" active={activeTab === "collaborative"} onClick={() => {setActiveTab("collaborative"); setIsMobileMenuOpen(false);}} />
        </nav>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0c0303]">
        {/* Header Header */}
        <header className="h-[48px] px-6 border-b border-white/5 flex justify-between items-center sticky top-0 bg-[#00303] backdrop-blur-md z-40">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
              <input 
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent pl-6 pr-4 text-sm font-normal focus:outline-none transition-all placeholder:text-zinc-700"
              />
            </div>
            {/* User Footer Footer */}
            <div className="w-8 h-8 rounded-full bg-ide-bg flex items-center justify-center text-[#DC2626]">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                </div>
          </div>
        </header>

        {/* Project Grid Project Grid */}
        <div className="p-8 md:p-12 overflow-y-auto">
          <div className="flex items-center gap-2 mb-8 text-zinc-600">
            <Clock size={12} />
            <span className="text-[10px] uppercase tracking-[0.2em] font-normal">Recent Projects</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={() => navigate(`/editor/${project.id}`)} />
            ))}
          </div>
        </div>
      </main>

      {/* --- Modal (Exact match to Editor Rename/Add/Delete Modals) --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {setIsModalOpen(false); setNewProjectName("");}} 
        title="Create New Project"
      >
        <form onSubmit={handleCreate} className="flex flex-col gap-4 pt-2">
          <input
            autoFocus
            type="text"
            className="bg-[#2A2A2A] border border-zinc-600 p-2 rounded text-white outline-none focus:border-ide-accent font-normal text-sm transition-colors"
            placeholder="e.g. workspace-alpha"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              className="text-zinc-400 hover:text-white px-3 text-sm font-normal transition-colors"
              onClick={() => {setIsModalOpen(false); setNewProjectName("")}}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newProjectName.trim()}
              className={`px-4 py-2 rounded transition-all text-sm font-normal
                ${!newProjectName.trim()
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50"
                  : "bg-[#DC26268e] hover:bg-ide-accent text-white cursor-pointer"
                }`}
            >
              Create
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// Sidebar Button Helper (Neutral + Sharp selection)
function SidebarBtn({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-normal transition-all ${active ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"}`}>
      <span className={active ? "text-ide-accent" : "text-zinc-500"}>{icon}</span>
      {label}
    </button>
  );
}

// Project Card Helper (Structured Utility Design)
function ProjectCard({ project, onClick }: { project: any, onClick: () => void }) {
  return (
    <div onClick={onClick} className="group p-5 rounded-lg border border-white/5 bg-[#1C1C1C] hover:border-ide-accent/40 transition-all cursor-pointer relative flex flex-col hover:bg-white/[0.02]">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded bg-white/5 text-zinc-500 group-hover:text-ide-accent transition-colors">
          <Folder className="w-5 h-5" strokeWidth={1.5} />
        </div>
        {project.type !== "mine" && (
          <div className="px-2 py-0.5 rounded-sm bg-amber-500/10 border border-amber-500/20 text-[9px] uppercase tracking-widest text-amber-500 font-normal">
            {project.type}
          </div>
        )}
      </div>
      <h3 className="text-sm font-normal mb-1 tracking-tight truncate text-zinc-200 group-hover:text-white transition-colors">{project.name}</h3>
      <div className="flex items-center gap-2 text-zinc-600 text-[11px] font-normal">
        <span>{project.owner}</span>
        <span>{project.updated}</span>
      </div>
      <div className="mt-6 flex justify-between items-center pt-4 border-t border-white/[0.03]">
        <span className="text-[9px] text-zinc-700 font-normal uppercase tracking-widest">ID: {project.id}</span>
        <ChevronRight size={14} className="text-zinc-800 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
}