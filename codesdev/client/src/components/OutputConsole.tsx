import { Terminal, X, Trash2, ChevronRight } from "lucide-react";
import type { OutputConsoleProps } from "../types/types";
import { useEffect, useRef } from "react";

export default function OutputConsole({ logs, onClear, onClose, height }: OutputConsoleProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom whenever logs change
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
            {/* Header: Title and Controls */}
            <div className="flex items-center justify-between px-4 py-1.5 bg-ide-bg select-none">
                <div className="flex items-center gap-2 text-zinc-400 capitalize">
                    <Terminal size={18} />
                    <span>Output</span>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={onClear} 
                        className="hover:text-white text-zinc-500 transition-colors" 
                        title="Clear Console"
                    >
                        <Trash2 size={16} />
                    </button>

                    <button 
                        onClick={onClose} 
                        className="hover:text-white text-zinc-500 transition-colors"
                        title="Close Console"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Content: Log Stream */}
            <div 
                ref={scrollRef} 
                className="flex-1 overflow-y-auto custom-scrollbar"
            >
                {logs.length === 0 ? (
                    <div className="p-4">
                        <span className="text-zinc-600 italic">No output to show...</span>
                    </div>
                ) : (
                    logs.map((log, i) => {
                        const config = {
                            error:   { icon: 'text-red-500',   text: 'text-red-400 font-medium' },
                            success: { icon: 'text-green-500', text: 'text-green-400' },
                            info:    { icon: 'text-blue-400',  text: 'text-blue-300 italic' },
                            log:     { icon: 'text-zinc-500',  text: 'text-zinc-300' }
                        }[log.type] || { icon: 'text-zinc-500', text: 'text-zinc-300' };

                        return (
                            <div 
                                key={i} 
                                className="flex items-start px-4 py-2 border-b border-white/[0.03] leading-relaxed group hover:bg-white/[0.02] transition-colors"
                            >
                                <ChevronRight 
                                    size={14} 
                                    className={`mr-2 mt-1 shrink-0 ${config.icon}`} 
                                />
                                <span className={`break-all whitespace-pre-wrap ${config.text}`}>
                                    {log.text}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}