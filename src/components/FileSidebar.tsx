import type { folderStructureData } from "../types/types";
import FolderStructure from "./FolderStructure";
import  {FolderPlus, FilePlus}from "lucide-react";

export default function FileSidebar({data, menuPos, handleContextMenu, pendingParentId, setPendingParentId, newItemType, setNewItemType, addItemToData, deleteItemId, setDeleteItemId, isAddModalOpen, setIsAddModalOpen, isDeleteModalOpen, setIsDeleteModalOpen,  width, openedId, handleOpenedId, openedFileTabsId, handleOpenedFileTabsId, expandedIds, handleExpandedIds, itemLookup}: { data: folderStructureData[], menuPos: {x: number, y: number} | null, handleContextMenu: (e: React.MouseEvent, item: folderStructureData) => void, pendingParentId: number | null, setPendingParentId: (prev: number | null) => void, newItemType: "file" | "folder" | null, setNewItemType: (prev: "file" | "folder") => void, setIsDeleteModalOpen: (prev: boolean) => void, setDeleteItemId: (prev: number | null) => void, isAddModalOpen: boolean, setIsAddModalOpen: (prev: boolean) => void, isDeleteModalOpen: boolean, deleteItemId: number | null, addItemToData: (item: folderStructureData) => void, width: string, openedId: number | null, handleOpenedId: (id: number) => void, openedFileTabsId: number[], handleOpenedFileTabsId: (id: number, toggle?: boolean) => void, expandedIds: number[], handleExpandedIds: (id: number) => void, itemLookup: Map<number, folderStructureData>}) {
    function addItem(e: React.MouseEvent, itemType: "file" | "folder") {
        e.stopPropagation();
        setIsAddModalOpen(true);
        setNewItemType(itemType);
        setPendingParentId(null);
    }

    return (
        <div className="flex flex-col overflow-hidden select-none cursor-default">
            {/* Sidebar */}
            <aside className="h-screen min-w-[5vw] max-w-[35vw] bg-[#130505] text-white overflow-auto resize-x"
                style={{ width: `${width}vw` }}>   

                <h2 className="my-4 text-center text-xl">project name</h2>
                <div className="flex items-center justify-end mx-2 mb-1 gap-2">
                    <button>
                        <FilePlus onClick= {(e) => addItem(e, "file")} size={18} className="text-zinc-500 hover:text-white"/>
                    </button>
                    <button>
                        <FolderPlus onClick= {(e) => addItem(e, "folder")} size={18} className="text-zinc-500 hover:text-white"/>
                    </button>
                </div>
                <FolderStructure data={data} menuPos={menuPos} handleContextMenu={handleContextMenu} pendingParentId={pendingParentId} setPendingParentId={setPendingParentId} newItemType={newItemType} setNewItemType={setNewItemType} isAddModalOpen={isAddModalOpen} setIsAddModalOpen={setIsAddModalOpen} addItemToData={addItemToData} isIdOpened={openedId} handleIsIdOpened={handleOpenedId}
                openedFileTabsId={openedFileTabsId} handleOpenedFileTabsId={handleOpenedFileTabsId}
                expandedIds={expandedIds} handleExpandedIds={handleExpandedIds} itemLookup={itemLookup} deleteItemId={deleteItemId} isDeleteModalOpen={isDeleteModalOpen} setIsDeleteModalOpen={setIsDeleteModalOpen}
                setDeleteItemId={setDeleteItemId}/>
            </aside>
        </div>
    )
}
