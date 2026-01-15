import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, Search, LayoutGrid, List, User, Share2, 
  Folder, ChevronRight, HardDrive, Edit2, Trash2, Users, UserPlus, X 
} from "lucide-react";
import Modal from "../components/Modal";

// Types
type ViewMode = "grid" | "list";
type Category = "all" | "mine" | "shared-in" | "shared-out";

interface Collaborator {
  name: string;
  avatarUrl?: string;
}

// Mock Data and Helpers
const getAvatar = (id: number) => `https://i.pravatar.cc/150?img=${id}`;

const mockUsers: Record<string, Collaborator> = {
  "You": { name: "You", avatarUrl: getAvatar(3) },
  "Alex": { name: "Alex Rivera", avatarUrl: getAvatar(10) },
  "Jordan": { name: "Jordan Lee", avatarUrl: getAvatar(12) },
  "ProfSmith": { name: "Professor Smith", avatarUrl: getAvatar(15) },
  "DevTeam": { name: "Dev Team Core", avatarUrl: undefined },
  "Sarah": { name: "Sarah Chen", avatarUrl: getAvatar(5) },
  "Mike": { name: "Mike Davis", avatarUrl: getAvatar(8) },
};

export default function HomePage() {
  const navigate = useNavigate();
  
  // Layout and Resizing State
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [isResizing, setIsResizing] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [activeTab, setActiveTab] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const [newItemName, setNewItemName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Projects
  const [projects, setProjects] = useState([
    { id: "collab-editor", name: "project-1", date: "Jan 14, 2026", category: "mine", owner: mockUsers["You"], 
      sharedWith: [mockUsers["Alex"], mockUsers["Jordan"], mockUsers["Sarah"], mockUsers["Mike"]] },
    { id: "ppo-agent", name: "project-2", date: "Dec 30, 2025", category: "mine", owner: mockUsers["You"], sharedWith: [] },
    { id: "resnet-action", name: "project-3", date: "Dec 16, 2025", category: "shared-in", owner: mockUsers["ProfSmith"], 
      sharedWith: [mockUsers["You"], mockUsers["Alex"]] },
    { id: "os-paging", name: "project-4", date: "Dec 07, 2025", category: "mine", owner: mockUsers["You"], sharedWith: [] },
    { id: "crawler-project", name: "project-5", date: "Nov 22, 2025", category: "shared-out", owner: mockUsers["You"], 
      sharedWith: [mockUsers["DevTeam"]] },
  ]);

  const selectedProjectData = projects.find(p => p.id === selectedProjectId);

  // Sidebar Resizing
  const handleMouseDown = (e: React.MouseEvent) => { e.preventDefault(); setIsResizing(true); };
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    const newWidth = e.clientX;
    if (newWidth >= 180 && newWidth <= 480) setSidebarWidth(newWidth);
  }, [isResizing]);

  const handleMouseUp = useCallback(() => { setIsResizing(false); }, []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = 'col-resize';
    } else {
      document.body.style.cursor = 'default';
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === "all" || p.category === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [projects, searchQuery, activeTab]);

  // Project Action Handlers
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault(); if (!newItemName.trim()) return;
    const id = `proj-${Date.now()}`;
    setProjects([{ id, name: newItemName, date: "Jan 15, 2026", category: "mine", owner: mockUsers["You"], sharedWith: [] }, ...projects]);
    setIsAddModalOpen(false); setNewItemName(""); navigate(`/editor/${id}`);
  };

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    setProjects(prev => prev.map(p => p.id === selectedProjectId ? { ...p, name: newItemName } : p));
    setIsRenameModalOpen(false); setNewItemName("");
  };

  const handleDelete = () => {
    setProjects(prev => prev.filter(p => p.id !== selectedProjectId));
    setIsDeleteModalOpen(false);
  };

  return (
    <div className={`fixed inset-0 h-screen w-screen overflow-hidden grid grid-rows-[48px_1fr] bg-[#050505] text-white font-sans ${isResizing ? 'select-none' : ''}`}>
      
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 w-full h-12 bg-[#dc2626] border-b border-black/10 z-50">
        <div className="flex-1 flex justify-start">
          <h1 className="font-normal text-[16px]">codesdev</h1>
        </div>
        <div className="flex-1 flex justify-center max-w-2xl px-4">
          <div className="relative group w-full max-w-125">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full bg-[#1e1e1e33] border border-transparent rounded-md py-1.5 pl-9 pr-4 text-sm outline-none text-white focus:bg-black/20 focus:border-white/10 transition-all placeholder:text-white/40" 
            />
          </div>
        </div>
        <div className="flex-1 flex justify-end gap-3">
          <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-md text-[13px] border border-white/5 font-medium transition-all">
            <Plus size={16} strokeWidth={2.5} /><span>New Project</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-[#D1D5DB] flex items-center justify-center text-[#4B5563] cursor-pointer shadow-sm">
            <User size={20} />
          </div>
        </div>
      </nav>

      <div className="flex h-full overflow-hidden">
        {/* Sidebar */}
        <aside style={{ width: `${sidebarWidth}px` }} className="border-r border-white/5 bg-[#0a0a0a] flex flex-col py-4 px-3 gap-1 shrink-0 relative z-10">
          <SidebarBtn icon={<HardDrive size={18} />} label="All Projects" active={activeTab === "all"} onClick={() => setActiveTab("all")} />
          <SidebarBtn icon={<User size={18} />} label="My Projects" active={activeTab === "mine"} onClick={() => setActiveTab("mine")} />
          <SidebarBtn icon={<Users size={18} />} label="Shared with Me" active={activeTab === "shared-in"} onClick={() => setActiveTab("shared-in")} />
          <SidebarBtn icon={<Share2 size={18} />} label="Shared by Me" active={activeTab === "shared-out"} onClick={() => setActiveTab("shared-out")} />
          <div onMouseDown={handleMouseDown} className={`absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-[#dc2626]/50 transition-colors z-20 ${isResizing ? 'bg-[#dc2626]' : ''}`} />
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto bg-[#050505] p-6 relative">
          <div className="max-w-300 mx-auto">
            <header className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-medium tracking-tight text-zinc-100">Workspace</h2>
               <div className="flex bg-[#1a1a1a] p-0.5 rounded-md border border-white/5 shadow-sm">
                <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-sm transition-all ${viewMode === "list" ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}><List size={16} /></button>
                <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-sm transition-all ${viewMode === "grid" ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}><LayoutGrid size={16} /></button>
               </div>
            </header>

            {viewMode === "list" ? (
              <div className="w-full border border-white/6 rounded-lg overflow-hidden bg-[#0a0a0a] shadow-sm">
                <div className="grid grid-cols-[1.5fr_1fr_1fr_100px_0.8fr_80px] gap-4 px-6 py-3 bg-[#0a0a0a] border-b border-white/6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest sticky top-0 z-10">
                  <span>Name</span><span>Creator</span><span>Status</span><span>Collaborators</span><span>Created</span><span className="text-right">Actions</span>
                </div>
                <div className="divide-y divide-white/4">
                  {filteredProjects.map(p => (
                    <ProjectListRow key={p.id} project={p} onOpen={() => navigate(`/editor/${p.id}`)}
                      onRename={() => { setSelectedProjectId(p.id); setNewItemName(p.name); setIsRenameModalOpen(true); }}
                      onDelete={() => { setSelectedProjectId(p.id); setIsDeleteModalOpen(true); }}
                      onManageSharing={() => { setSelectedProjectId(p.id); setIsShareModalOpen(true); }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProjects.map(p => (
                  <ProjectCard key={p.id} project={p} onOpen={() => navigate(`/editor/${p.id}`)}
                    onRename={() => { setSelectedProjectId(p.id); setNewItemName(p.name); setIsRenameModalOpen(true); }}
                    onDelete={() => { setSelectedProjectId(p.id); setIsDeleteModalOpen(true); }}
                    onManageSharing={() => { setSelectedProjectId(p.id); setIsShareModalOpen(true); }}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <Modal isOpen={isAddModalOpen} onClose={() => {setIsAddModalOpen(false); setNewItemName("")}} title="Create New Project">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <input autoFocus type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="bg-[#2A2A2A] border border-zinc-600 p-2 rounded text-white outline-none focus:border-[#dc2626] transition-all" placeholder="workspace-name" />
          <div className="flex justify-end gap-2">
            <button type="button" className="text-zinc-400 hover:text-white px-3" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
            <button type="submit" className="bg-[#DC26268e] hover:bg-[#dc2626] text-white px-4 py-2 rounded transition-all font-medium">Create</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isRenameModalOpen} onClose={() => setIsRenameModalOpen(false)} title="Rename Workspace">
        <form onSubmit={handleRename} className="flex flex-col gap-4">
          <input autoFocus type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="bg-[#2A2A2A] border border-zinc-600 p-2 rounded text-white outline-none focus:border-[#dc2626] transition-all" />
          <div className="flex justify-end gap-2">
            <button type="button" className="text-zinc-400 hover:text-white px-3" onClick={() => setIsRenameModalOpen(false)}>Cancel</button>
            <button type="submit" className="bg-[#DC26268e] hover:bg-[#dc2626] text-white px-4 py-2 rounded transition-all font-medium">Rename</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Project">
        <div className="flex flex-col gap-5">
          <p className="text-zinc-400 text-sm">Delete <span className="text-white font-medium">{projects.find(p => p.id === selectedProjectId)?.name}</span>? This is permanent.</p>
          <div className="flex justify-end gap-2">
            <button type="button" className="text-zinc-400 hover:text-white px-3" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
            <button onClick={handleDelete} className="bg-[#DC26268e] hover:bg-red-600 text-white px-4 py-2 rounded transition-colors font-medium">Delete</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} title="Project Collaborators">
        <div className="flex flex-col gap-4">
            <p className="text-zinc-400 text-sm mb-2">People with access to <span className="text-white font-medium">{selectedProjectData?.name}</span>:</p>
            <div className="flex flex-col gap-2 max-h-75 overflow-y-auto pr-2">
                {/* Owner Slot */}
                <div className="flex items-center justify-between bg-[#111111] p-3 rounded-md border border-white/5">
                    <div className="flex items-center gap-3">
                        <Avatar collaborator={selectedProjectData?.owner} />
                        <div>
                            <p className="text-sm text-zinc-200">{selectedProjectData?.owner.name}</p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Owner</p>
                        </div>
                    </div>
                </div>
                 {/* Collaborators List */}
                 {selectedProjectData?.sharedWith
                    .filter(c => c.name !== selectedProjectData.owner.name)
                    .map((collaborator, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#111111] p-3 rounded-md border border-white/5 group">
                        <div className="flex items-center gap-3">
                            <Avatar collaborator={collaborator} />
                            <div>
                                <p className="text-sm text-zinc-200">{collaborator.name}</p>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Collaborator</p>
                            </div>
                        </div>
                        <button className="text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1"><X size={14} /></button>
                    </div>
                ))}
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-white/5">
                <button className="bg-[#DC26268e] hover:bg-[#dc2626] text-white px-4 py-2 rounded transition-colors font-medium text-sm flex items-center gap-2">
                    <UserPlus size={14} /> Add People
                </button>
            </div>
        </div>
      </Modal>
    </div>
  );
}

// Sub-Components

function Avatar({ collaborator, size = "md" }: { collaborator?: Collaborator, size?: "sm" | "md" }) {
    const sizeClasses = size === "sm" ? "w-5 h-5 text-[9px]" : "w-8 h-8 text-xs";
    if (!collaborator) return null;
    if (collaborator.avatarUrl) {
        return <img src={collaborator.avatarUrl} alt={collaborator.name} className={`${sizeClasses} rounded-full border border-black/50 object-cover`} />;
    }
    return (
        <div className={`${sizeClasses} rounded-full bg-zinc-800 border border-black/50 flex items-center justify-center font-bold text-zinc-400`}>
            {collaborator.name[0]}
        </div>
    );
}

function AvatarStack({ collaborators, onClick }: { collaborators: Collaborator[], onClick: (e: React.MouseEvent) => void }) {
    const shown = collaborators.slice(0, 3);
    const remaining = collaborators.length - 3;
    return (
        <div className="flex -space-x-1.5 hover:opacity-80 transition-opacity cursor-pointer shrink-0" onClick={onClick}>
            {shown.map((c, i) => (
                <div key={i} className="ring-2 ring-[#0a0a0a] rounded-full relative" style={{ zIndex: 10 - i }}>
                    <Avatar collaborator={c} size="sm" />
                </div>
            ))}
            {remaining > 0 && (
                 <div className="w-5 h-5 rounded-full bg-zinc-700 border border-black/50 flex items-center justify-center text-[9px] font-bold text-zinc-300 ring-2 ring-[#0a0a0a] relative z-0">
                 +{remaining}
             </div>
            )}
        </div>
    )
}

function ProjectListRow({ project, onOpen, onRename, onDelete, onManageSharing }: any) {
  const isSharedIn = project.category === "shared-in";
  const isSharedOut = project.sharedWith.length > 0 && project.category !== "shared-in";

  return (
    <div onClick={onOpen} className="grid grid-cols-[1.5fr_1fr_1fr_100px_0.8fr_80px] gap-4 px-6 py-3.5 items-center hover:bg-white/3 group cursor-pointer transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <Folder size={16} className="shrink-0 text-zinc-500 group-hover:text-[#dc2626] transition-colors" />
        <span className="text-[13px] font-medium text-zinc-200 truncate">{project.name}</span>
      </div>
      <div className="text-[12px] text-zinc-400 truncate">{project.owner.name}</div>
      <div className="flex items-center min-w-0">
        {isSharedIn && <span className="px-1.5 py-0.5 rounded-sm bg-blue-500/10 text-blue-400 text-[9px] font-bold uppercase tracking-tight w-fit">Shared with me</span>}
        {isSharedOut && <span className="px-1.5 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase tracking-tight w-fit">Shared by me</span>}
        {!isSharedIn && !isSharedOut && <span className="text-zinc-600 text-[10px] font-medium px-1">Private</span>}
      </div>
      <div className="flex items-center justify-start min-w-0 h-full">
         {project.sharedWith.length > 0 ? (
           <AvatarStack collaborators={project.sharedWith} onClick={(e) => { e.stopPropagation(); onManageSharing(); }} />
         ) : (
           <span className="text-[11px] text-zinc-700 italic font-medium">None</span>
         )}
      </div>
      <div className="text-[12px] text-zinc-500 font-mono">{project.date}</div>
      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={(e) => { e.stopPropagation(); onRename(); }} className="shrink-0 p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white transition-colors"><Edit2 size={16}/></button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="shrink-0 p-1 hover:bg-red-500/10 rounded text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
      </div>
    </div>
  );
}

function ProjectCard({ project, onOpen, onRename, onDelete, onManageSharing }: any) {
  const isSharedIn = project.category === "shared-in";
  const isSharedOut = project.sharedWith.length > 0 && project.category !== "shared-in";

  return (
    <div onClick={onOpen} className="bg-[#0a0a0a] border border-white/6 rounded-xl p-5 hover:border-[#dc2626]/40 transition-all cursor-pointer group h-48 flex flex-col justify-between shadow-sm hover:shadow-md hover:bg-[#0e0e0e]">
      <div className="flex justify-between items-start">
        <Folder size={24} className="shrink-0 text-zinc-600 group-hover:text-[#dc2626] transition-colors" />
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit2 size={16} className="shrink-0 text-zinc-500 hover:text-white p-0.5 transition-colors" onClick={(e) => { e.stopPropagation(); onRename(); }}/>
          <Trash2 size={16} className="shrink-0 text-zinc-500 hover:text-red-500 p-0.5 transition-colors" onClick={(e) => { e.stopPropagation(); onDelete(); }}/>
        </div>
      </div>
      <div>
        <h3 className="text-[15px] font-medium text-zinc-200 mb-1 truncate">{project.name}</h3>
        <p className="text-[11px] text-zinc-500 mb-3">By {project.owner.name}</p>
        <div className="flex items-center justify-between pt-3 border-t border-white/6">
           <div className="flex flex-col gap-1.5 min-w-0">
             {isSharedIn && <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Shared with me</span>}
             {isSharedOut && <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Shared by me</span>}
             
             {/* Date and Collaborators Stack for Shared Context */}
             {(isSharedIn || isSharedOut) && (
                <AvatarStack collaborators={project.sharedWith} onClick={(e) => { e.stopPropagation(); onManageSharing(); }} />
             )}
             <span className="text-[10px] text-zinc-600 font-mono mt-0.5">{project.date}</span>
           </div>
           <ChevronRight size={14} className="text-zinc-800 group-hover:text-[#dc2626] transition-transform group-hover:translate-x-0.5 shrink-0" />
        </div>
      </div>
    </div>
  );
}

function SidebarBtn({ icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2 rounded-md text-[13px] font-medium transition-all ${active ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/2"}`}>
      <span className={active ? "text-[#dc2626]" : "text-zinc-500"}>{icon}</span>{label}
    </button>
  );
}