import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import type folderStructureData from "../types/types";

export default function FolderStructure({ data, depth = 0 }: { data: folderStructureData[], depth?: number }) {
    const [expandedIds, setExpandedIds] = useState<number[]>([]);

    function handleClick(itemId: number) {
        setExpandedIds(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]);
    }

    return (
        <ul className="text-[14px]">
        {data.map(item => {
            const isOpen = expandedIds.includes(item.id);
            
            return (
            <li key={item.id}>
                {item.type === "file" ? 
                
                    <div style={{ paddingLeft: `${depth * 16 + 34}px`}} className="hover:bg-[#2a1a1a]">{item.name}</div>
                
                : (
                    <>
                        <div style={{ paddingLeft: `${depth * 16 + 12}px`}} className="flex gap-1 hover:bg-[#2a1a1a]">
                            <button onClick={() => handleClick(item.id)}>
                                {isOpen ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}
                            </button>
                            {item.name}
                        </div>

                        {isOpen && typeof(item.children) !== "undefined" ? 
                        <FolderStructure data={item.children} depth={depth + 1} />
                        : null}
                    </>
                    
                )}
            </li>
        )})}
    </ul>
    )
}