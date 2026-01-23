import { History, Clock } from "lucide-react";
import type { VersionHistoryProps } from "../types/types";

export default function VersionHistory({ versions, onRevert, onPreview, activePreviewId }: VersionHistoryProps) {
  if (versions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-ide-bg">
        <History size={32} className="text-zinc-800 mb-4" />
        <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">No History</p>
        <p className="text-[10px] text-zinc-600 mt-2 leading-relaxed">
          Create a "Checkpoint" in the navbar to save a snapshot of your workspace.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-ide-bg border-l border-white/5">
      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-ide-bg flex items-center gap-2">
        <History size={14} className="text-[#dc2626]" />
        <h3 className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
          Node History
        </h3>
      </div>
      
      {/* Scrollable Timeline */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-ide-bg">
        <div className="relative border-l border-zinc-800 ml-2 space-y-1 pb-4">
          {versions.map((version) => {
            const isNamed = !!version.label;
            const isSelected = activePreviewId === version.id;
            const displayName = version.label || "Auto-saved version";
            
            return (
              <div 
                key={version.id}
                onClick={() => onPreview(version.id)}
                className={`relative pl-6 py-3 group cursor-pointer transition-all rounded-r-md
                  ${!isNamed && !isSelected ? 'opacity-60 hover:opacity-100' : ''}
                  ${isSelected ? 'bg-white/4 opacity-100' : 'hover:bg-white/2'}`}
              >
                {/* Timeline Dot */}
                <div className={`absolute left-[-5.5px] top-5 w-2.5 h-2.5 rounded-full border transition-all z-10
                  ${isSelected 
                    ? 'bg-[#dc2626] border-[#dc2626] scale-125 shadow-[0_0_10px_rgba(220,38,38,0.5)]' 
                    : isNamed 
                      ? 'bg-zinc-700 border-zinc-600 group-hover:bg-[#dc2626] group-hover:border-[#dc2626]' 
                      : 'bg-zinc-900 border-zinc-800 group-hover:bg-zinc-600'}`} 
                />
                
                <div className="flex flex-col min-w-0 select-none">
                  <span
                    className={`text-[13px] truncate block transition-colors 
                      ${isSelected ? 'text-white font-bold' : isNamed ? 'text-zinc-100 font-semibold' : 'text-zinc-400 font-normal italic'}`}
                    title={displayName}
                  >
                    {displayName}
                  </span>
                  
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1.5 text-zinc-600 shrink-0">
                      <Clock size={10} />
                      <span className="text-[10px] font-mono">
                        {new Date(version.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onRevert(version.id);
                      }}
                      className="text-[9px] text-[#dc2626] opacity-0 group-hover:opacity-100 uppercase tracking-widest font-bold hover:underline shrink-0 ml-2"
                    >
                      Restore
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}