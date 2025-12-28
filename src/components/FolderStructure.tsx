import { ChevronDown, ChevronRight, FolderPlus, FilePlus } from "lucide-react";
import type folderStructureData from "../types/types";

export default function FolderStructure({ data, addItemToData, depth = 0, isIdOpened, handleIsIdOpened, openedFileTabsId, handleOpenedFileTabsId, expandedIds, handleExpandedIds, itemLookup}: { data: folderStructureData[], addItemToData: (item: folderStructureData) => void, depth?: number, isIdOpened: number | null, handleIsIdOpened: (id: number) => void, openedFileTabsId: number[], handleOpenedFileTabsId: (id: number, toggle?: boolean) => void, expandedIds: number[], handleExpandedIds: (id: number) => void, itemLookup: Map<number, folderStructureData>}) {
    
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
                
                    <div onClick={() => handleClick(item)} style={{ paddingLeft: `${depth * 16 + 34}px`}} className={(item.id === isIdOpened) ? "bg-[#dc26268e] flex gap-1 items-center" : "flex gap-1 hover:bg-[#2E2E2E] items-center"}>
                        {item.name}
                        </div>
                
                : (
                    <>
                        <div onClick={() => handleClick(item)} style={{ paddingLeft: `${depth * 16 + 12}px`}} className={(item.id === isIdOpened) ? "group bg-[#DC26268e] flex gap-1 items-center" : "group flex gap-1 hover:bg-[#2e2e2e] items-center"}>
                                {isOpen ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}
                            {item.name}
                            <FilePlus size={16} className="hidden group-hover:flex text-zinc-500 hover:text-white ml-auto mr-2"/>
                            <FolderPlus size={16} className="hidden text-zinc-500 hover:text-white group-hover:flex mr-2"/>
                        </div>

                        {isOpen && typeof(item.children) !== "undefined" ? 
                        <FolderStructure data={item.children} addItemToData={addItemToData} depth={depth + 1} isIdOpened={isIdOpened} handleIsIdOpened={handleIsIdOpened}
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