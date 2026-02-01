import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, Search, LayoutGrid, List, User, Share2, 
  Folder, ChevronRight, HardDrive, Edit2, Trash2, Users, UserPlus, X, 
  LogOut
} from "lucide-react";
import Modal from "../components/Modal";
import { AVATAR_MAP } from "../constants/avatars";
import type { Category, ViewMode, ModalType } from "../../types/types";

// Helper to handle relative and absolute dating
const formatProjectDate = (dateInput: any, currentTime: number) => {
  if (!dateInput) return "Just now";
  const date = new Date(dateInput);
  const diffInSeconds = Math.max(0, Math.floor((currentTime - date.getTime()) / 1000));

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function HomePage() {
  const navigate = useNavigate();
  const API_BASE = "http://localhost:5001/api";
  const [user, setUser] = useState<any>(null);
  
  // Layout and Resizing State
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [isResizing, setIsResizing] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [activeTab, setActiveTab] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [now, setNow] = useState(Date.now()); // The Heartbeat timestamp

  // Action Manager State
  const [projects, setProjects] = useState<any[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [target, setTarget] = useState<{ project: any | null, type: ModalType }>({
    project: null,
    type: null
  });

  // Helper to get CSRF from cookies
  const getCSRF = () => {
    const match = document.cookie.match(/csrf_access_token=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : "";
  };

  // API Handlers
  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/projects`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/me`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Identity fetch failed:", err);
      }
    };
    fetchUser();
  }, [API_BASE]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': getCSRF() },
        body: JSON.stringify({ name: newItemName }),
        credentials: 'include'
      });
      if (res.ok) {
        const newProject = await res.json();
        const projectWithDate = { ...newProject, created_at: new Date().toISOString() };
        setProjects([projectWithDate, ...projects]);
        setTarget({ project: null, type: null });
        setNewItemName("");
        navigate(`/editor/${newProject.id}`, { state: { projectName: newProject.name } });
      }
    } catch (err) { alert("Create failed"); }
  };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target.project) return;
    try {
      const res = await fetch(`${API_BASE}/projects/${target.project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': getCSRF() },
        body: JSON.stringify({ name: newItemName }),
        credentials: 'include'
      });
      if (res.ok) {
        setProjects(prev => prev.map(p => p.id === target.project.id ? { ...p, name: newItemName } : p));
        setTarget({ project: null, type: null });
        setNewItemName("");
      }
    } catch (err) { alert("Rename failed"); }
  };

  const handleDelete = async () => {
    if (!target.project) return;
    try {
      const res = await fetch(`${API_BASE}/projects/${target.project.id}`, {
        method: 'DELETE',
        headers: { 'X-CSRF-TOKEN': getCSRF() },
        credentials: 'include'
      });
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== target.project.id));
        setTarget({ project: null, type: null });
      }
    } catch (err) { alert("Delete failed"); }
  };

  // UI Helpers
  const openModal = (type: ModalType, project: any = null) => {
    setTarget({ type, project });
    if (type === 'rename' && project) setNewItemName(project.name);
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === "all" || p.category === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [projects, searchQuery, activeTab]);

  const handleMouseDown = (e: React.MouseEvent) => { e.preventDefault(); setIsResizing(true); };
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    const newWidth = e.clientX;
    if (newWidth >= 180 && newWidth <= 480) setSidebarWidth(newWidth);
  }, [isResizing]);
  const handleMouseUp = useCallback(() => { setIsResizing(false); }, []);

  const handleLogout = async () => {
    try {
        const res = await fetch(`${API_BASE}/logout`, {
            method: "POST",
            headers: { "X-CSRF-TOKEN": getCSRF() },
            credentials: "include"
        });
        if (res.ok) navigate("/login", { replace: true });
    } catch (err) {
        console.error("Logout failed");
    }
  };

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

  return (
    <div className={`fixed inset-0 h-screen w-screen overflow-hidden grid grid-rows-[48px_1fr] bg-[#050505] text-white font-sans selection:bg-[#dc2626] ${isResizing ? 'select-none' : ''}`}>
      
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 w-full h-12 bg-[#dc2626] border-b border-black/10 z-50">
        <div className="flex-1 flex justify-start"><h1 className="font-normal text-[16px]">codesdev</h1></div>
        <div className="flex-1 flex justify-center max-w-2xl px-4">
          <div className="relative group w-full max-w-125">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
            <input type="text" placeholder="Search projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#1e1e1e33] border border-transparent rounded-md py-1.5 pl-9 pr-4 text-sm outline-none text-white focus:bg-black/20 focus:border-white/10 transition-all placeholder:text-white/40" />
          </div>
        </div>
        {/* --- Navbar Right Section --- */}
        <div className="flex-1 flex justify-end gap-3 items-center">
          {/* New Project Button */}
          <button onClick={() => openModal('create')} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md text-[13px] border border-white/5 font-medium transition-all">
            <Plus size={16} strokeWidth={2.5} /><span>New Project</span>
          </button>

          {/* Profile Avatar with Hover Menu */}
          <div className="relative group px-1">
            {/* Avatar Trigger */}
            <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer overflow-hidden transition-all group-hover:ring-2 group-hover:ring-white/40
                    ${user?.avatar_url 
                        ? 'bg-transparent border-none' 
                        : 'bg-zinc-900 border border-black/20'
                    }`}
            >
                {user?.avatar_url ? (
                    <img src={user.avatar_url} className="w-full h-full object-cover" alt="Profile" />
                ) : user?.avatar_id ? (
                    <img src={AVATAR_MAP[user.avatar_id]} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-[12px] font-bold text-zinc-500">
                      {user?.username?.[0].toUpperCase()}
                    </span>
                )}
            </div>

            {/* Hover Dropdown */}
            <div className="absolute right-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                <div className="w-48 bg-[#121212] border border-white/10 rounded-lg shadow-2xl overflow-hidden py-1">
                    <div className="px-4 py-2 border-b border-white/5 mb-1">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Username</p>
                        <p className="text-sm text-white truncate">{user?.username}</p>
                    </div>

                    <button 
                        onClick={() => navigate("/profile")}
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

      <div className="flex h-full overflow-hidden">
        <aside style={{ width: `${sidebarWidth}px` }} className="border-r border-white/5 bg-ide-bg flex flex-col py-4 px-3 gap-1 shrink-0 relative z-10">
          <SidebarBtn icon={<HardDrive size={18} />} label="All Projects" active={activeTab === "all"} onClick={() => setActiveTab("all")} />
          <SidebarBtn icon={<User size={18} />} label="My Projects" active={activeTab === "mine"} onClick={() => setActiveTab("mine")} />
          <SidebarBtn icon={<Users size={18} />} label="Shared with Me" active={activeTab === "shared-in"} onClick={() => setActiveTab("shared-in")} />
          <SidebarBtn icon={<Share2 size={18} />} label="Shared by Me" active={activeTab === "shared-out"} onClick={() => setActiveTab("shared-out")} />
          <div onMouseDown={handleMouseDown} className={`absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-[#dc2626]/50 transition-colors z-20 ${isResizing ? 'bg-[#dc2626]' : ''}`} />
        </aside>

        <main className="flex-1 overflow-y-auto bg-[#050505] p-6 relative">
          <div className="max-w-300 mx-auto">
            <header className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-medium tracking-tight text-zinc-100">Workspace</h2>
               <div className="flex bg-[#1a1a1a] p-0.5 rounded-md border border-white/5 shadow-sm">
                <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-sm transition-all ${viewMode === "list" ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}><List size={16} /></button>
                <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-sm transition-all ${viewMode === "grid" ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}><LayoutGrid size={16} /></button>
               </div>
            </header>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
                <div className="w-8 h-8 border-2 border-[#dc2626] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm font-mono uppercase tracking-widest text-[#dc2626]">Syncing Hub...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/5 rounded-xl">
                <Folder size={48} className="text-zinc-800 mb-4" />
                <p className="text-zinc-400 text-sm">No active projects found.</p>
              </div>
            ) : (
              viewMode === "list" ? (
                <div className="w-full border border-white/6 rounded-lg overflow-hidden bg-[#0a0a0a] shadow-sm">
                  <div className="grid grid-cols-[1.5fr_1fr_1fr_120px_0.8fr_80px] gap-4 px-6 py-3 bg-[#0a0a0a] border-b border-white/6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest sticky top-0 z-10">
                    <span>Name</span><span>Creator</span><span>Status</span><span>Collaborators</span><span>Created</span><span className="text-right">Actions</span>
                  </div>
                  <div className="divide-y divide-white/4">
                    {filteredProjects.map(p => (
                      <ProjectListRow key={p.id} project={p} now={now} onOpen={() => navigate(`/editor/${p.id}`, { state: { projectName: p.name } })} onAction={(type: ModalType) => openModal(type, p)} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredProjects.map(p => (
                    <ProjectCard key={p.id} project={p} now={now} onOpen={() => navigate(`/editor/${p.id}`, { state: { projectName: p.name } })} onAction={(type: ModalType) => openModal(type, p)} />
                  ))}
                </div>
              )
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <Modal isOpen={target.type === 'create'} onClose={() => setTarget({ project: null, type: null })} title="New Project">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <input autoFocus type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="bg-[#2A2A2A] border border-zinc-600 p-2 rounded text-white outline-none focus:border-[#dc2626]" placeholder="project-name" />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setTarget({ project: null, type: null })} className="text-zinc-400 hover:text-white px-3">Cancel</button>
            <button type="submit" className="bg-[#DC26268e] hover:bg-[#dc2626] text-white px-4 py-2 rounded transition-all">Initialize</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={target.type === 'rename'} onClose={() => setTarget({ project: null, type: null })} title="Rename Project">
        <form onSubmit={handleRename} className="flex flex-col gap-4">
          <input autoFocus type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="bg-[#2A2A2A] border border-zinc-600 p-2 rounded text-white outline-none focus:border-[#dc2626]" />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setTarget({ project: null, type: null })} className="text-zinc-400 hover:text-white px-3">Cancel</button>
            <button type="submit" className="bg-[#DC26268e] hover:bg-[#dc2626] text-white px-4 py-2 rounded transition-all">Save</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={target.type === 'delete'} onClose={() => setTarget({ project: null, type: null })} title="Delete Project">
        <div className="flex flex-col gap-5">
          <p className="text-zinc-400 text-sm">Delete <span className="text-white font-medium">{target.project?.name}</span>? This is permanent.</p>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setTarget({ project: null, type: null })} className="text-zinc-400 hover:text-white px-3">Cancel</button>
            <button onClick={handleDelete} className="bg-[#DC26268e] hover:bg-red-600 text-white px-4 py-2 rounded">Delete</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={target.type === 'share'} onClose={() => setTarget({ project: null, type: null })} title="Collaborators">
        <div className="flex flex-col gap-4">
            <p className="text-zinc-400 text-sm mb-2">Access for <span className="text-white font-medium">{target.project?.name}</span>:</p>
            <div className="flex items-center justify-between bg-[#111111] p-3 rounded-md border border-white/5">
                <div className="flex items-center gap-3">
                    <Avatar collaborator={target.project?.owner} />
                    <div>
                        <p className="text-sm text-zinc-200">{target.project?.owner?.name || "You"}</p>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold">Owner</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-white/5">
                <button className="bg-[#DC26268e] hover:bg-[#dc2626] text-white px-4 py-2 rounded text-sm flex items-center gap-2"><UserPlus size={14} /> Add</button>
            </div>
        </div>
      </Modal>
    </div>
  );
}

// Sub-Components
function ProjectListRow({ project, now, onOpen, onAction }: any) {
  const sharedWith = project.sharedWith || [];
  return (
    <div onClick={onOpen} className="grid grid-cols-[1.5fr_1fr_1fr_120px_0.8fr_80px] gap-4 px-6 py-3.5 items-center hover:bg-white/3 group cursor-pointer transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <Folder size={16} className="text-zinc-500 group-hover:text-[#dc2626]" />
        <span className="text-[13px] font-medium text-zinc-200 truncate">{project.name}</span>
      </div>
      <div className="text-[12px] text-zinc-400">{project.owner?.name || "You"}</div>
      <div className="text-[10px] text-zinc-600 uppercase font-medium">Private</div>
      <div className="flex items-center h-full">
         {sharedWith.length > 0 ? <AvatarStack collaborators={sharedWith} onClick={(e) => { e.stopPropagation(); onAction('share'); }} /> : <span className="text-[11px] text-zinc-700 italic">None</span>}
      </div>
      <div className="text-[12px] text-zinc-500 font-mono">{formatProjectDate(project.created_at || project.date, now)}</div>
      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={(e) => { e.stopPropagation(); onAction('rename'); }} className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white"><Edit2 size={16}/></button>
        <button onClick={(e) => { e.stopPropagation(); onAction('delete'); }} className="p-1 hover:bg-red-500/10 rounded text-zinc-400 hover:text-red-500"><Trash2 size={16}/></button>
      </div>
    </div>
  );
}

function ProjectCard({ project, now, onOpen, onAction }: any) {
  const sharedWith = project.sharedWith || [];
  return (
    <div onClick={onOpen} className="bg-[#0a0a0a] border border-white/6 rounded-xl p-5 hover:border-[#dc2626]/40 transition-all cursor-pointer group h-48 flex flex-col justify-between shadow-sm hover:bg-[#0e0e0e]">
      <div className="flex justify-between items-start">
        <Folder size={24} className="text-zinc-600 group-hover:text-[#dc2626]" />
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit2 size={16} className="text-zinc-500 hover:text-white p-0.5" onClick={(e) => { e.stopPropagation(); onAction('rename'); }}/>
          <Trash2 size={16} className="text-zinc-500 hover:text-red-500 p-0.5" onClick={(e) => { e.stopPropagation(); onAction('delete'); }}/>
        </div>
      </div>
      <div>
        <h3 className="text-[15px] font-medium text-zinc-200 mb-1 truncate">{project.name}</h3>
        <p className="text-[11px] text-zinc-500">By {project.owner?.name || "You"}</p>
        <div className="flex items-center justify-between pt-3 border-t border-white/6 mt-3">
           <div className="flex flex-col">
             <AvatarStack collaborators={sharedWith} onClick={(e) => { e.stopPropagation(); onAction('share'); }} />
             <span className="text-[10px] text-zinc-600 font-mono mt-2">{formatProjectDate(project.created_at || project.date, now)}</span>
           </div>
           <ChevronRight size={14} className="text-zinc-800 group-hover:text-[#dc2626] transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </div>
  );
}

function SidebarBtn({ icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2 rounded-md text-[13px] font-medium transition-all ${active ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/2"}`}>
      <span className={active ? "text-[#dc2626]" : "text-zinc-500"}>{icon}</span>{label}
    </button>
  );
}

function Avatar({ collaborator, size = "md" }: any) {
  const sizeClasses = size === "sm" ? "w-5 h-5" : "w-8 h-8";
  const avatarSrc = collaborator?.avatar_url || (collaborator?.avatar_id ? AVATAR_MAP[collaborator.avatar_id] : null);

  return (
    <div className={`${sizeClasses} rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center text-zinc-400 font-bold text-xs overflow-hidden`}>
        {avatarSrc ? (
          <img src={avatarSrc} className="w-full h-full object-cover" />
        ) : (
          <span>{collaborator?.name ? collaborator.name[0].toUpperCase() : "?"}</span>
        )}
    </div>
  );
}

function AvatarStack({ collaborators, onClick }: { collaborators: any[], onClick: (e: React.MouseEvent<HTMLDivElement>) => void }) {
    return (
        <div className="flex -space-x-1.5 cursor-pointer" onClick={(e) => { e.stopPropagation(); onClick(e); }}>
            {collaborators.slice(0, 3).map((c: any, i: number) => (
                <div key={i} className="ring-2 ring-[#0a0a0a] rounded-full relative" style={{ zIndex: 10 - i }}><Avatar collaborator={c} size="sm" /></div>
            ))}
            {collaborators.length > 3 && <div className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center text-[9px] text-zinc-300 ring-2 ring-[#0a0a0a]">+{collaborators.length - 3}</div>}
        </div>
    )
}