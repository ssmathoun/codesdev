import { Search, FileCode } from "lucide-react";
import type { CommandPaletteProps } from "../../types/types";

export default function CommandPalette({ isOpen, onClose, query, setQuery, results, onSelect, getPath, itemLookup }: CommandPaletteProps) {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-100 flex justify-center pt-[15vh] bg-black/40 backdrop-blur-sm px-4"
            onClick={onClose}
        >
            <div 
                className="w-full max-w-2xl bg-[#252526] border border-ide-border shadow-2xl rounded-xl overflow-hidden h-fit"
                onClick={e => e.stopPropagation()}
            >
                {/* Search Input Area */}
                <div className="flex items-center px-4 py-4 border-b border-ide-border gap-4">
                    <Search size={20} className="text-zinc-500" />
                    <input
                        autoFocus
                        placeholder="Search files by name..."
                        className="bg-transparent w-full outline-none text-zinc-200 text-lg placeholder:text-zinc-600"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                {/* Results List */}
                <div className="max-h-87.5 overflow-y-auto custom-scrollbar py-2">
                    {results.length > 0 ? (
                        results.map((file) => (
                            <button
                                key={file.id}
                                onClick={() => { onSelect(file.id); onClose(); }}
                                className="w-full flex items-center justify-between px-6 py-3 hover:bg-ide-accent/10 border-l-2 border-transparent hover:border-ide-accent transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <FileCode size={18} className="text-zinc-500 group-hover:text-ide-accent" />
                                    <span className="text-zinc-300 group-hover:text-white font-medium">{file.name}</span>
                                    <span className="text-zinc-500 text-xs">{
                                        getPath(file.id)
                                            .slice(0, -1)
                                            .map(id => itemLookup.get(id)?.name)
                                            .join("/")
                                        }
                                        
                                    </span>
                                </div>
                                <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">File</span>
                            </button>
                        ))
                    ) : query && (
                        <div className="p-10 text-center text-zinc-500 text-sm">
                            No files matching <span className="text-zinc-300">"{query}"</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}