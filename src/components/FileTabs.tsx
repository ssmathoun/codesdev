import { useCallback, useMemo, useState } from "react";
import type { folderStructureData } from "../types/types";
import { X, ChevronRight } from "lucide-react";

export default function FileTabs({data, openedId, handleOpenedId, openedFileTabsId, handleOpenedFileTabsId,
expandedIds, handleExpandedIds, itemLookup} : { data: folderStructureData[], openedId: number | null, handleOpenedId: (id: number) => void, openedFileTabsId: number[], handleOpenedFileTabsId: (id: number, toggle?: boolean) => void , expandedIds: number[], handleExpandedIds: (id: number) => void, itemLookup: Map<number, folderStructureData>}) {


    const getPath = useCallback((itemId: number): number[] => {
        const path: number[] = [];

        function findPath(item: folderStructureData | undefined): number[] | null {
            if (!item) return null;
            path.push(item.id);
            if (item.parent == null) {
                return path;
            }
            const parentItem = itemLookup.get(item.parent);
            return findPath(parentItem);
        }
        findPath(itemLookup.get(itemId));
        return path.reverse();
    }, [data, itemLookup]);

    function handleClick(itemId: number) {
        const path = getPath(itemId);
        
        path.forEach(id => {
            if (!expandedIds.includes(id)){
                handleExpandedIds(id);
            }
        }) 
        
        handleOpenedId(itemId);
    }

    function toggleTab(itemId: number, toggle: boolean = false) {
        handleOpenedFileTabsId(itemId, toggle);
    }

    return (
        <>
            <div className="flex h-9 bg-[#130505] text-white items-center text-[14px]">
            {/* Opened File Tabs */}
            {openedFileTabsId.map(itemId => {
                const item = itemLookup.get(itemId);
                return (
                <span key={itemId} onClick={() => handleClick(itemId)} className="flex items-center justify-between w-35 h-9 px-3 border border-[#2E2E2E] hover:bg-[#1e1e1e] select-none cursor-default"
                style={(itemId === openedId) ? {backgroundColor: "#1E1E1E"} : {}}>
                {item?.name}
                <X size={12} onClick={(e) => {e.stopPropagation();toggleTab(itemId, true)}} className="ml-2 hover:text-[#DC2626]"/>
                </span>
                )})}
            </div>

            <div className="flex h-4 bg-[#1E1E1E] text-zinc-400 items-center text-[14px] px-3 py-3">
            <span className="select-none cursor-default">project name</span>
            {getPath(openedId ?? -1).length > 0 ? <ChevronRight size={20} strokeWidth={1} className="inline "/> : null}
            
                {getPath(openedId ?? -1).map((id, index, array) => {
                    return (
                        <span key={id} className="flex items-center select-none cursor-default">
                            {itemLookup.get(id)?.name}
                            {index < array.length - 1 ? <ChevronRight size={20} strokeWidth={1} className="inline "/> : null}
                        </span>
                    )
                })}
            </div>
        </>

    )
}