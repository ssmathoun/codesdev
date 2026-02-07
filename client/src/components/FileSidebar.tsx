import { useState, useEffect } from "react";
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
    handleRename,
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
    handleRename: (newName: string) => void;
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

    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(projectName);

    // Sync tempName if projectName changes from outside (like initial load)
    useEffect(() => {
        setTempName(projectName);
    }, [projectName]);

    const submitRename = () => {
        setIsEditing(false);
        // Only trigger update if name actually changed and isn't empty
        if (tempName.trim() && tempName !== projectName) {
            handleRename(tempName);
        } else {
            setTempName(projectName); // Revert if empty/same
        }
    };
    
    function addItem(e: React.MouseEvent, itemType: "file" | "folder", forceRoot = false) {
        e.stopPropagation();
        setIsAddModalOpen(true);
        setNewItemType(itemType);
        // If forceRoot is true, we ignore activeFolderId and set it to null (Root)
        setPendingParentId(forceRoot ? null : activeFolderId);
    }

    return (
        /* Sidebar Container */
        <aside
            className={`flex flex-col relative h-full w-full bg-ide-bg text-white transition-none shrink-0 whitespace-nowrap border-r border-ide-border select-none
                ${!isSidebarVisible ? "invisible overflow-hidden" : "visible"}`}
                style={{ width: 'inherit' }}
        >
            {/* Header Section */}
            <div className="shrink-0 pt-6 pb-2 px-2">
                {isEditing && !readOnly ? (
                    <input
                        autoFocus
                        className="w-full bg-[#1e1e1e] text-white text-center border-b border-ide-accent outline-none text-sm font-bold uppercase tracking-wider py-1"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onBlur={submitRename}
                        onKeyDown={(e) => e.key === 'Enter' && submitRename()}
                    />
                ) : (
                    <h2 
                        className={`text-sm font-bold text-center truncate tracking-wider uppercase py-1 border-b border-transparent ${!readOnly ? 'cursor-text hover:text-ide-accent/80 transition-colors' : ''}`}
                        onClick={() => !readOnly && setIsEditing(true)}
                        title={!readOnly ? "Click to Rename Project" : ""}
                    >
                        {projectName}
                    </h2>
                )}
                
                {/* Root Action Buttons */}
                {!readOnly && (
                    <div className="flex items-center justify-end mt-2 mr-1 gap-2 opacity-100 transition-opacity">
                        <button
                            title="New File in Root (Ctrl+N)"
                            onClick={(e) => addItem(e, "file", true)}
                            className="p-1 rounded hover:bg-zinc-800 transition-colors"
                        >
                            <FilePlus
                                size={16}
                                className="text-zinc-500 hover:text-white"
                            />
                        </button>
                        <button
                            title="New Folder in Root"
                            onClick={(e) => addItem(e, "folder", true)}
                            className="p-1 rounded hover:bg-zinc-800 transition-colors"
                        >
                            <FolderPlus
                                size={16}
                                className="text-zinc-500 hover:text-ide-accent"
                            />
                        </button>
                    </div>
                )}
            </div>

            {/* File Tree / Empty State Area */}
            <div 
                className="flex-1 overflow-y-auto overflow-x-hidden overscroll-behavior-contain custom-scrollbar relative"
                onClick={(e) => {
                    // Only deselect if they clicked the blank space, not a folder item
                    if (e.target === e.currentTarget && !readOnly) {
                        setActiveFolderId(null);
                    }
                }}
            >
                {data.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center w-full mt-12 px-4 text-center select-none group opacity-80 hover:opacity-100 transition-opacity">
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

                        {!readOnly && (
                            <div className="flex items-center gap-2">
                                {/* Create File */}
                                <button 
                                    onClick={(e) => addItem(e, "file", true)}
                                    className="text-[11px] font-medium text-ide-accent border border-ide-accent/30 bg-ide-accent/5 px-3 py-1.5 rounded hover:bg-ide-accent hover:text-white hover:border-ide-accent transition-all duration-200"
                                >
                                    Create File
                                </button>

                                {/* Create Folder */}
                                <button 
                                    onClick={(e) => addItem(e, "folder", true)}
                                    title="Create Folder"
                                    className="text-[11px] font-medium text-zinc-400 border border-zinc-700/50 bg-white/5 px-3 py-1.5 rounded hover:bg-zinc-700 hover:text-white hover:border-zinc-600 transition-all duration-200"
                                >
                                    Folder
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Folder Structure */
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