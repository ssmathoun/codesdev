import type { folderStructureData } from "../types/types";
import FolderStructure from "./FolderStructure";
import { FolderPlus, FilePlus } from "lucide-react";

export default function FileSidebar({
    data,
    projectName,
    readOnly = false,
    menuPos,
    handleContextMenu,
    pendingParentId,
    setPendingParentId,
    newItemType,
    setNewItemType,
    addItemToData,
    deleteItemId,
    setDeleteItemId,
    isAddModalOpen,
    setIsAddModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    openedId,
    handleOpenedId,
    openedFileTabsId,
    handleOpenedFileTabsId,
    expandedIds,
    handleExpandedIds,
    itemLookup,
    isSidebarVisible,
    activeFolderId,
    setActiveFolderId,
    isResizing,
    handleMouseDown
}: {
    data: folderStructureData[];
    projectName: string;
    readOnly?: boolean;
    menuPos: { x: number; y: number } | null;
    handleContextMenu: (e: React.MouseEvent, item: folderStructureData) => void;
    pendingParentId: number | null;
    setPendingParentId: (prev: number | null) => void;
    newItemType: "file" | "folder" | null;
    setNewItemType: (prev: "file" | "folder") => void;
    setIsDeleteModalOpen: (prev: boolean) => void;
    setDeleteItemId: (prev: number | null) => void;
    isAddModalOpen: boolean;
    setIsAddModalOpen: (prev: boolean) => void;
    isDeleteModalOpen: boolean;
    deleteItemId: number | null;
    addItemToData: (item: folderStructureData) => void;
    openedId: number | null;
    handleOpenedId: (id: number) => void;
    openedFileTabsId: number[];
    handleOpenedFileTabsId: (id: number, toggle?: boolean) => void;
    expandedIds: number[];
    handleExpandedIds: (id: number) => void;
    itemLookup: Map<number, folderStructureData>;
    isSidebarVisible: boolean;
    activeFolderId: number | null;
    setActiveFolderId: (prev: number | null) => void;
    isResizing: boolean;
    handleMouseDown: (e: React.MouseEvent) => void;
}) {
    function addItem(e: React.MouseEvent, itemType: "file" | "folder") {
        e.stopPropagation();
        setIsAddModalOpen(true);
        setNewItemType(itemType);
        setPendingParentId(activeFolderId);
    }

    return (
        /* Sidebar */
        <aside
            className={`flex flex-col relative h-full w-full bg-ide-bg text-white transition-none shrink-0 whitespace-nowrap
                ${!isSidebarVisible ? "invisible overflow-hidden" : "visible"}`}
                style={{ width: 'inherit' }}
        >
            <div className="shrink-0">
                <h2 className="my-4 mx-2 text-center text-xl font-normal tracking-normal truncate">
                    {projectName}
                </h2>
                
                {!readOnly ? (
                    <div className="flex items-center justify-end mx-2 mb-1 gap-2">
                        <button
                            title="New File (Ctrl+N)"
                            onClick={(e) => addItem(e, "file")}
                        >
                            <FilePlus
                                size={18}
                                className="text-zinc-500 hover:text-white"
                            />
                        </button>
                        <button
                            title="New Folder"
                            onClick={(e) => addItem(e, "folder")}
                        >
                            <FolderPlus
                                size={18}
                                className="text-zinc-500 hover:text-white"
                            />
                        </button>
                    </div>
                ) : null}
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-behavior-contain custom-scrollbar">
                <FolderStructure
                    data={data}
                    readOnly={readOnly}
                    menuPos={menuPos}
                    handleContextMenu={handleContextMenu}
                    pendingParentId={pendingParentId}
                    setPendingParentId={setPendingParentId}
                    newItemType={newItemType}
                    setNewItemType={setNewItemType}
                    isAddModalOpen={isAddModalOpen}
                    setIsAddModalOpen={setIsAddModalOpen}
                    addItemToData={addItemToData}
                    isIdOpened={openedId}
                    handleIsIdOpened={handleOpenedId}
                    openedFileTabsId={openedFileTabsId}
                    handleOpenedFileTabsId={handleOpenedFileTabsId}
                    expandedIds={expandedIds}
                    handleExpandedIds={handleExpandedIds}
                    itemLookup={itemLookup}
                    deleteItemId={deleteItemId}
                    isDeleteModalOpen={isDeleteModalOpen}
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                    setDeleteItemId={setDeleteItemId}
                    activeFolderId={activeFolderId}
                    setActiveFolderId={setActiveFolderId}
                />
            </div>
        </aside>
    );
}
