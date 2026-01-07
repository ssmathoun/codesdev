import { Terminal, X, Trash2, ChevronRight } from "lucide-react";
import type { OutputConsoleProps } from "../types/types";
import { useEffect, useRef } from "react";

export default function OutputConsole({ logs, onClear, onClose, height }: OutputConsoleProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div 
            style={{ height: `${height}px` }}
            className="flex flex-col bg-ide-bg border-t border-[#2E2E2E] w-full font-mono text-sm"
        >
            { /* Console header */ }
            <div className="flex items-center justify-between px-4 py-1.5 bg-ide-bg select-none">
                <div className="flex items-center gap-2 text-zinc-400 capitalize">
                    <Terminal size={18} />
                    <span>Output</span>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={onClear} className="hover:text-white text-zinc-500 transition-colors" title="Clear Console">
                        <Trash2 size={16} />
                    </button>

                    <button onClick={onClose} className="hover:text-white text-zinc-500 transition-colors">
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Console Content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                {logs.length === 0 ? (
                    <span className="text-zinc-600 italic">No output to show...</span>
                ) : (
                    logs.map((log, i) => (
                        <div key={i} className="flex items-start text-zinc-300 leading-relaxed group">
                            <ChevronRight size={14} className="text-green-500 mr-2 mt-1 shrink-0" />
                            <span className="break-all whitespace-pre-wrap">{log}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}