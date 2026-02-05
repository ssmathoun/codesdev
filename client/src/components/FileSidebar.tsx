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
                                className="text-zinc-500 hover:text-ide-accent"
                            />
                        </button>
                    </div>
                ) : null}
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-behavior-contain custom-scrollbar relative">
                {data.length === 0 ? (
                    <div className="flex flex-col items-center mt-20 px-2 text-center select-none group">
                        <div className="p-4 rounded-full bg-white/5 mb-3 border border-transparent group-hover:border-ide-accent/20 group-hover:bg-ide-accent/5 transition-all duration-300">
                            <FilePlus 
                                size={24} 
                                strokeWidth={1.5} 
                                className="text-zinc-600 group-hover:text-ide-accent transition-colors duration-300"
                            />
                        </div>

                        <p className="text-xs font-medium text-zinc-500 mb-4 whitespace-normal">
                            Project is empty
                        </p>

                        {/* Interactive Buttons Row */}
                        {!readOnly && (
                            <div className="flex items-center gap-2">
                                {/* Create File */}
                                <button 
                                    onClick={(e) => addItem(e, "file")}
                                    className="text-[11px] font-medium text-ide-accent border border-ide-accent/30 bg-ide-accent/5 px-3 py-1.5 rounded hover:bg-ide-accent hover:text-white hover:border-ide-accent transition-all duration-200"
                                >
                                    Create File
                                </button>

                                {/* Create Folder */}
                                <button 
                                    onClick={(e) => addItem(e, "folder")}
                                    title="Create Folder"
                                    className="text-[11px] font-medium text-zinc-400 border border-zinc-700/50 bg-white/5 px-3 py-1.5 rounded hover:bg-zinc-700 hover:text-white hover:border-zinc-600 transition-all duration-200"
                                >
                                    Folder
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
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
                )}
            </div>
        </aside>
    );
}
