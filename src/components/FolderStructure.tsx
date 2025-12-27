import { ChevronDown, ChevronRight } from "lucide-react";
import type folderStructureData from "../types/types";

export default function FolderStructure({ data, depth = 0, isIdOpened, handleIsIdOpened, openedFileTabsId, handleOpenedFileTabsId, expandedIds, handleExpandedIds, itemLookup}: { data: folderStructureData[], depth?: number, isIdOpened: number | null, handleIsIdOpened: (id: number) => void, openedFileTabsId: number[], handleOpenedFileTabsId: (id: number) => void, expandedIds: number[], handleExpandedIds: (id: number) => void, itemLookup: Map<number, folderStructureData>}) {
    
    function handleClick(item: folderStructureData) {
        handleExpandedIds(item.id);
        handleIsIdOpened(item.id);
        
        if (item.type === "file") {
            handleOpenedFileTabsId(item.id);
        }
    }

    return (
        <ul className="text-[14px]">
        {data.map(item => {
            const isOpen = expandedIds.includes(item.id);
            
            return (
            <li key={item.id}>
                {item.type === "file" ? 
                
                    <div onClick={() => handleClick(item)} style={{ paddingLeft: `${depth * 16 + 34}px`}} className={(item.id === isIdOpened) ? "bg-[#dc26268e] flex gap-1" : "flex gap-1 hover:bg-[#2E2E2E]"}>{item.name}</div>
                
                : (
                    <>
                        <div onClick={() => handleClick(item)} style={{ paddingLeft: `${depth * 16 + 12}px`}} className={(item.id === isIdOpened) ? "bg-[#DC26268e] flex gap-1" : "flex gap-1 hover:bg-[#2e2e2e]"}>
                                {isOpen ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}
                            {item.name}
                        </div>

                        {isOpen && typeof(item.children) !== "undefined" ? 
                        <FolderStructure data={item.children} depth={depth + 1} isIdOpened={isIdOpened} handleIsIdOpened={handleIsIdOpened}
                        openedFileTabsId={openedFileTabsId} handleOpenedFileTabsId={handleOpenedFileTabsId} expandedIds={expandedIds} handleExpandedIds={handleExpandedIds}
                        itemLookup={itemLookup}/>
                        : null}
                    </>
                    
                )}
            </li>
        )})}
    </ul>
    )
}