import { useCallback, useRef, useEffect} from "react";
import type { folderStructureData } from "../types/types";
import { X, ChevronRight } from "lucide-react";

export default function FileTabs({data, getPath, handleOpenTab, openedId, handleOpenedId, openedFileTabsId, handleOpenedFileTabsId,
expandedIds, handleExpandedIds, itemLookup} : { data: folderStructureData[], getPath: (id: number) => number[], handleOpenTab: (id: number) => void, openedId: number | null, handleOpenedId: (id: number) => void, openedFileTabsId: number[], handleOpenedFileTabsId: (id: number, toggle?: boolean) => void , expandedIds: number[], handleExpandedIds: (id: number) => void, itemLookup: Map<number, folderStructureData>}) {

    const tabRefs = useRef<Map<number, HTMLDivElement>>(new Map());
    const breadcrumbRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (openedId !== null) {
            const activeTab = tabRefs.current.get(openedId);
            if (activeTab) {
                activeTab.scrollIntoView({
                    block: "nearest",
                    inline: "center"
                });
            }
        }

        if (openedId && breadcrumbRef.current) {
            breadcrumbRef.current.scrollLeft = breadcrumbRef.current.scrollWidth;
        }
    }, [openedId]);

    function toggleTab(itemId: number, toggle: boolean = false) {
        handleOpenedFileTabsId(itemId, toggle);
    }

    return (
        <>
            <div className="flex h-9 bg-ide-bg text-white items-center text-[14px] overflow-x-auto overflow-y-hidden flex-nowrap custom-scrollbar">
            {/* Opened File Tabs */}
            {openedFileTabsId.map(itemId => {
                const item = itemLookup.get(itemId);
                const isActive = itemId === openedId;

                if (!item) return null;
                
                return (
                    <div
                    key={itemId}
                    ref={(elm) => {
                        if (elm) tabRefs.current.set(itemId, elm);
                        else tabRefs.current.delete(itemId);
                    }}
                    onClick={() => handleOpenTab(itemId)}
                    className={`flex shrink-0 items-center justify-between min-w-30 max-w-50 h-full px-3 hover:bg-[#1E1E1E] hover:text-white border border-[#2E2E2E] cursor-pointer transition-colors ${
                        isActive ? "bg-[#1E1E1E] text-white border-t border-[#DC2C2C8E]" : "bg-ide-bg text-zinc-400"
                    }`}
                >
                <span className="truncate">
                    {item?.name}
                </span>
                <X size={12} onClick={(e) => {e.stopPropagation();toggleTab(itemId, true)}} className="ml-2 shrink-0 hover:text-ide-accent"/>
                </div>
                )})}
            </div>
            
            {/* Breadcrumbs */}
            <div ref={breadcrumbRef} className="flex h-4 bg-[#1E1E1E] text-zinc-400 items-center text-[14px] px-3 py-3 whitespace-nowrap overflow-x-auto overflow-y-hidden flex-nowrap custom-scrollbar select-none">
            <span className="select-none cursor-default">project name</span>
            {getPath(openedId ?? -1).length > 0 ? <ChevronRight size={20} strokeWidth={1} className="inline shrink-0"/> : null}
            
                {getPath(openedId ?? -1).map((id, index, array) => {
                    return (
                        <span key={id} className="flex items-center select-none cursor-default max-w-52">
                            <span className="truncate">
                            {itemLookup.get(id)?.name}
                            </span>
                            
                            {index < array.length - 1 ? <ChevronRight size={20} strokeWidth={1} className="inline shrink-0"/> : null}
                        </span>
                    )
                })}
            </div>
        </>

    )
}