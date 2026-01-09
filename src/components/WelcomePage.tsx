import { Search, Terminal as TerminalIcon } from "lucide-react";

export default function WelcomePage() {
    const Shortcut = ({ icon: Icon, label, keys }: { icon: any, label: string, keys: string[] }) => (
        <div className="flex items-center justify-between w-72 group px-4 py-2 hover:bg-white/5 rounded-lg transition-all border border-transparent hover:border-zinc-800">
            <div className="flex items-center gap-3 text-zinc-400 group-hover:text-zinc-200 transition-colors">
                <Icon size={18} />
                <span className="text-sm font-medium">{label}</span>
            </div>

            <div className="flex gap-1.5">
                {keys.map((key) => (
                    <kbd key={key} className="px-2 py-1 bg-[#252526] border border-zinc-700 rounded text-[10px] text-zinc-500 min-w-7 text-center shadow-md font-sans">
                        {key}
                    </kbd>
                ))}
            </div>
        </div>
    );

    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-[#1E1E1E] select-none animate-in fade-in duration-500">
            {/* Branding Section */}
            <div className="flex flex-col items-center mb-12">
                <h1 className="text-2xl font-bold text-zinc-200 tracking-tight"> codesdev Web IDE<span className="text-ide-accent"> v1.0</span></h1>
                <p className="text-zinc-500 text-sm mt-2 font-medium">Standardize your collaborative workflow in the cloud.</p>
            </div>
        
            {/* Shortcuts Grid */}
            <div className="flex flex-col gap-2">
                <Shortcut icon={Search} label="Search Files" keys={["Ctrl", "P"]} />
                <Shortcut icon={TerminalIcon} label="Toggle Console" keys={["Ctrl", "J"]} />
            </div>

            {/* Footer Tip */}
            <div className="mt-16 text-zinc-600 text-xs">
                Press <kbd className="bg-zinc-800 px-1 rounded">Esc</kbd> to close any open modals.
            </div>
        </div>
    );
}