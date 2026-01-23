import { ChevronDown, ChevronRight, Ellipsis } from "lucide-react";
import type { folderStructureData } from "../types/types";

export default function FolderStructure({ 
    data, 
    readOnly = false,
    menuPos, 
    handleContextMenu, 
    pendingParentId, 
    setPendingParentId, 
    newItemType, 
    setNewItemType, 
    deleteItemId, 
    setDeleteItemId, 
    isAddModalOpen, 
    setIsAddModalOpen, 
    isDeleteModalOpen, 
    setIsDeleteModalOpen, 
    addItemToData, 
    depth = 0, 
    isIdOpened, 
    handleIsIdOpened, 
    openedFileTabsId, 
    handleOpenedFileTabsId, 
    expandedIds, 
    handleExpandedIds, 
    itemLookup, 
    activeFolderId, 
    setActiveFolderId
}: { 
    data: folderStructureData[], 
    readOnly?: boolean, 
    menuPos: {x: number, y: number} | null, 
    handleContextMenu: (e: React.MouseEvent, item: folderStructureData) => void, 
    pendingParentId: number | null, 
    setPendingParentId: (prev: number | null) => void, 
    newItemType: "file" | "folder" | null, 
    setDeleteItemId: (prev: number | null) => void, 
    setNewItemType: (prev: "file" | "folder") => void, 
    addItemToData: (item: folderStructureData) => void, 
    depth?: number, 
    isIdOpened: number | null, 
    handleIsIdOpened: (id: number) => void, 
    openedFileTabsId: number[], 
    handleOpenedFileTabsId: (id: number, toggle?: boolean) => void, 
    expandedIds: number[], 
    handleExpandedIds: (id: number) => void, 
    itemLookup: Map<number, folderStructureData>,
    deleteItemId: number | null, 
    isAddModalOpen: boolean, 
    setIsAddModalOpen: (prev: boolean) => void, 
    isDeleteModalOpen: boolean, 
    setIsDeleteModalOpen: (prev: boolean) => void, 
    activeFolderId: number | null, 
    setActiveFolderId: (prev: number | null) => void,
}) {
    
    function handleClick(item: folderStructureData) {
        handleExpandedIds(item.id);
        handleIsIdOpened(item.id);
        
        if (item.type === "file") {
            handleOpenedFileTabsId(item.id);
        }
        else {
            // Only update active folder for context if NOT in read-only mode
            if (!readOnly) {
                setActiveFolderId(item.id);
            }
        }
    }

    return (
        <ul className="text-[14px]">
        {data.map(item => {
            const isOpen = expandedIds.includes(item.id);
            
            return (
            <li key={item.id}>
                {item.type === "file" ? 
                
                    <div onClick={() => handleClick(item)} style={{ paddingLeft: `${depth * 16 + 34}px`}} className={(item.id === isIdOpened) ? "bg-[#dc26268e] whitespace-nowrap flex gap-1 items-center group justify-between" : "flex gap-1 whitespace-nowrap hover:bg-[#2E2E2E] items-center group justify-between"}>
                        <span className="mr-2 truncate">
                            {item.name}
                        </span>
                        
                         {!readOnly && (
                            <Ellipsis 
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent opening the file when clicking menu
                                    handleContextMenu(e, item);
                                }} 
                                size={16} 
                                className="hidden text-zinc-500 hover:text-white group-hover:flex mr-2 ml-auto shrink-0"
                            />
                         )}
                    </div>
                
                : (
                    <>
                        <div onClick={() => handleClick(item)} style={{ paddingLeft: `${depth * 16 + 12}px`}} className={(item.id === activeFolderId && !readOnly) ? "group bg-[#2e2e2e] flex gap-1 whitespace-nowrap items-center" : "group flex gap-1 hover:bg-[#2e2e2e] items-center whitespace-nowrap"}>
                            {isOpen ? <ChevronDown size={18} className="shrink-0"/> : <ChevronRight size={18} className="shrink-0"/>}
                            <span className="mr-2 truncate">
                                {item.name}
                            </span>
                            
                            {!readOnly && (
                                <Ellipsis 
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent collapsing/expanding when clicking menu
                                        handleContextMenu(e, item);
                                    }} 
                                    size={16} 
                                    className="hidden text-zinc-500 hover:text-white group-hover:flex mr-2 ml-auto shrink-0"
                                />
                            )}
                        </div>

                        {isOpen && typeof(item.children) !== "undefined" ? 
                        <FolderStructure 
                            readOnly={readOnly}
                            newItemType={newItemType} 
                            menuPos={menuPos} 
                            handleContextMenu={handleContextMenu} 
                            setNewItemType={setNewItemType} 
                            data={item.children} 
                            pendingParentId={pendingParentId} 
                            setPendingParentId={setPendingParentId} 
                            addItemToData={addItemToData} 
                            depth={depth + 1} 
                            isIdOpened={isIdOpened} 
                            handleIsIdOpened={handleIsIdOpened}
                            openedFileTabsId={openedFileTabsId} 
                            handleOpenedFileTabsId={handleOpenedFileTabsId} 
                            expandedIds={expandedIds} 
                            handleExpandedIds={handleExpandedIds}
                            itemLookup={itemLookup} 
                            setDeleteItemId={setDeleteItemId} 
                            isDeleteModalOpen={isDeleteModalOpen} 
                            setIsDeleteModalOpen={setIsDeleteModalOpen}
                            deleteItemId={deleteItemId} 
                            isAddModalOpen={isAddModalOpen} 
                            setIsAddModalOpen={setIsAddModalOpen} 
                            activeFolderId={activeFolderId} 
                            setActiveFolderId={setActiveFolderId}
                        />
                        : null}
                    </>
                )}
            </li>
        )})}
    </ul>
    )
}