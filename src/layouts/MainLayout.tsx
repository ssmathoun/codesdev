import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import debounce from "lodash.debounce";
import CodeEditor from "../components/CodeEditor";
import FileSidebar from "../components/FileSidebar";
import ContextMenu from "../components/ContextMenu";
import type { folderStructureData } from "../types/types";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";
import OutputConsole from "../components/OutputConsole"
import CommandPalette from "../components/CommandPallete";

const dirData: folderStructureData[] = [
    { id: 1, name: 'index.tsx', type: 'file', content: 'index.tsx'},
    { id: 2, name: 'App.tsx', type: 'file', content: 'App.tsx'},
    { id: 3, name: 'components', type: 'folder', children: [
        { id: 4, name: 'headerFolder', type: 'folder', parent: 3, children: [
            { id: 9, name: 'Header.tsx', type: 'file', parent: 4,  content: 'Header.tsx'},
            { id: 10, name: 'Logo.tsx', type: 'file', parent: 4, content: 'Logo.tsx'},
        ] },
        { id: 5, name: 'Footer.tsx', type: 'file', parent: 3, content: 'Footer.tsx'},
    ]},
    { id: 6, name: 'styles', type: 'folder', children: [
        { id: 7, name: 'main.css', type: 'file', parent: 6, content: 'main.css' },
        { id: 8, name: 'theme.css', type: 'file', parent: 6, content: 'theme.css' },
    ]},
]

export default function MainLayout() {
    const { projectId } = useParams();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjectData = async () => {
            setIsLoading(true);
            try {
                // Placeholder: Later -> fetch(...)
                console.log(`Fetching data for room: ${projectId}`);
                
                // Simulating network delay
                await new Promise(res => setTimeout(res, 500));
                
                setData(dirData); 
            } catch (error) {
                setLogs(prev => [...prev, "Error: Failed to join project room."]);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchProjectData();
    }, [projectId]);

    const [data, setData] = useState<folderStructureData[]>(dirData);
    const addItemToData = (newItem: folderStructureData) : void => {
        const parentId = newItem.parent ?? null;
        
        if (parentId === null) {
            setData(prevData => [...prevData, newItem]);
        }
        else {
            const addItemRecusivley = (items: folderStructureData[]): folderStructureData[] => {
                return items.map(item => {
                    if (item.id === parentId && item.type === "folder") {
                        const updatedChildren = item.children ? [...item.children, newItem] : [newItem];
                        return { ...item, children: updatedChildren };
                    }
                    else {
                        if (item.children) {
                            return { ...item, children: addItemRecusivley(item.children) };
                        }
                        return item;
                    }
                })
            };
            setData(prevData => addItemRecusivley(prevData));
        }
    };

    const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

    const deleteItemFromData = (itemToDelete: folderStructureData) : void => {
        const deleteItemRecursively = (items: folderStructureData[]): folderStructureData[] => {
            return items.filter(item => item.id !== itemToDelete.id).map(item => {
                if (item.children) {
                    return { ...item, children: deleteItemRecursively(item.children) };
                }
                return item;
            });
        }
        setData(prevData => deleteItemRecursively(prevData));
    };

    const [isSaving, setIsSaving] = useState(false);

    const updateFileContent = (id: number, newContent: string) : void => {
        const updateContentRecursively = (items: folderStructureData[]): folderStructureData[] => {
            return items.map(item => {
                if (item.id === id && item.type === "file") {
                    return { ...item, content: newContent };
                }
                else {
                    if (item.children) {
                        return { ...item, children: updateContentRecursively(item.children) };
                    }
                    return item;
                }
            })
        }
        setData(prevData => updateContentRecursively(prevData) );
        setIsSaving(false);
    }
    
    const [sidebarWidth, setSidebarWidth] = useState("15"); // Tracks FileSidebar Width
    const [openedId, setOpenedId] = useState<number | null>(null); // Tracks Open File/Folder IDs
    const [activeFolderId, setActiveFolderId] = useState<number | null>(null);

    const handleOpenedId = (id: number) => {
        const item = itemLookup.get(id)
        if (item?.type === "file") {
            setOpenedId(id);
            setActiveFolderId(item.parent ? item.parent : null)
        }
    };
    const [openedFileTabsId, setOpenedFileTabsId] = useState<number[]>(openedId !== null ? [openedId] : []);
    const handleOpenedFileTabsId = (id: number, remove: boolean = false) => {
        if (remove) {
            setOpenedFileTabsId(prev => {
                const nextTabs = prev.filter(currentId => currentId !== id);
                if (nextTabs.length === 0) {
                    setOpenedId(null);
                    return [];
                }
                setOpenedId(prev => prev === id ? openedFileTabsId[(openedFileTabsId.indexOf(prev) - 1 + openedFileTabsId.length) % openedFileTabsId.length] : prev);
                return nextTabs;
            });
        }
        else {
            setOpenedFileTabsId(prev => prev.includes(id) ? prev : [...prev, id]); 
        }
    }


    /*
        Memoized lookup table for folder structure data by ID
    */
    const itemLookup = useMemo(() => {
        const map = new Map<number, folderStructureData>();
        
        function buildLookupTable(items: folderStructureData[]) {
            items.forEach(item => {
                map.set(item.id, item);
        
                if (item.children) {
                    buildLookupTable(item.children);
                }
            });
        }
    
            buildLookupTable(data);   
            return map;
        }, [data]);
    
    const getPath = useCallback((itemId: number | null): number[] => {
        if (itemId === null) return [];

        const path: number[] = [];
        const item = itemLookup.get(itemId);
        
        if (!item) return [];

        function findPath(item: folderStructureData | undefined): number[] | null {
            if (!item) return null;
            path.push(item.id);
            if (item.parent == null) {
                return path;
            }
            const parentItem = itemLookup.get(item.parent);
            return findPath(parentItem);
        }
        findPath(item);
        return path.reverse();
    }, [data, itemLookup]);
    
    const [expandedIds, setExpandedIds] = useState<number[]>([]);
    const handleExpandedIds = (id: number) => {
        if (itemLookup.get(id)?.type === "folder") {
            setExpandedIds(prev => prev.includes(id) ? prev.filter(currentId => currentId !== id) : [...prev, id]);
        }
    }

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [newItemName, setNewItemName] = useState("");
    const [newItemType, setNewItemType] = useState(null as "file" | "folder" | null);

    const debouncedUpdate = useCallback(
        debounce((id: number, content: string) => {
            updateFileContent(id, content);
        }, 1000),
        []
    );

    useEffect(() => {
        return () => {
            debouncedUpdate.cancel();
        };
    }, [debouncedUpdate]);

    const isNameDuplicate = (name: string, parentId: number | null, excludeId?: number): boolean => {
        const siblings = parentId
            ? itemLookup.get(parentId)?.children || []
            : data;
        
        return siblings.some(item =>
            item.name.toLowerCase() === name.trim().toLowerCase() &&
            item.id !== excludeId
        );
    };

    const [modalError, setModalError] = useState("");

    const addNewItem = (itemName: string) => {
        const trimmedName = itemName.trim();
        if (trimmedName === "" || newItemType === null) return;

        if (isNameDuplicate(trimmedName, pendingParentId)) {
            //Add
        }
        const newItemId = Date.now();

        addItemToData({
            id: newItemId,
            name: itemName,
            type: newItemType!,
            parent: pendingParentId,
            content: newItemType === "file" ? "" : undefined,
            children: newItemType === "folder" ? [] : undefined,
        });

        if (pendingParentId !== null) {
            setExpandedIds(prev => prev.includes(pendingParentId!) ? prev : [...prev, pendingParentId!]);
        }

        if (newItemType === "file") {
            handleOpenedFileTabsId(newItemId);
        }

        setNewItemType(null);
        setOpenedId(newItemId);
        setNewItemName("");
        setIsAddModalOpen(false);
        setPendingParentId(null);
    };

    const renameItem = (itemName: string) => {
        const trimmedName = itemName.trim();
        if (trimmedName === "" || newItemType === null) return;

        const itemToRename = itemLookup.get(deleteItemId!);
        const parentId = itemToRename?.parent ?? null;

        if (isNameDuplicate(trimmedName, parentId, deleteItemId!)) {
            //Add
        }


        const renameRecursively = (items: folderStructureData[]): folderStructureData[] => {
            return items.map(item => {
                if (item.id === deleteItemId) {
                    return { ...item, name: itemName };
                }
                else {
                    if (item.children) {
                        return { ...item, children: renameRecursively(item.children) };
                    }
                    return item;
                }
            });

        };

        setData(prevData => renameRecursively(prevData));
        setNewItemType(null);
        setNewItemName("");
        setIsRenameModalOpen(false);
    };

    const deleteItem = (deleteItemId: number) => {
        const itemToDelete = itemLookup.get(deleteItemId);
        if (!itemToDelete) return;
    
        const collectAllIds = (item: folderStructureData): number[] => {
            let ids = [item.id];
            if (item.children) {
                item.children.forEach(child => {
                    ids = [...ids, ...collectAllIds(child)];
                });
            }
            return ids;
        };
    
        const idsToRemove = collectAllIds(itemToDelete);
    
        if (openedId && idsToRemove.includes(openedId)) {
            setOpenedId(null);
        }
    
        setOpenedFileTabsId(prev => prev.filter(id => !idsToRemove.includes(id)));
        setExpandedIds(prev => prev.filter(id => !idsToRemove.includes(id)));
        deleteItemFromData(itemToDelete);
        setDeleteItemId(null);
        setIsDeleteModalOpen(false);
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
    };

    const [pendingParentId, setPendingParentId] = useState<number | null>(null);
    const [isResizing, setIsResizing] = useState(false);

    /*
    Function to resize the sidebar on mouse down event.
    */
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
        
        const handleMouseMove = (moveEvent: MouseEvent) => {
            const newWidth = (moveEvent.clientX / window.innerWidth) * 100;

            if (newWidth >= 10 && newWidth <= 40) {
                setSidebarWidth(newWidth.toString());
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

    };

    const [menuPos, setMenuPos] = useState<{x: number, y: number} | null>(null);

    const handleContextMenu = (e: React.MouseEvent, item: folderStructureData) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();

        const menuHeight = 150;
        const menuWidth = 140;

        let y = rect.bottom + 5;
        let x = rect.left;

        if (rect.bottom + menuHeight > window.innerHeight) {
            y = rect.top - menuHeight - 5;
        }
        if (rect.left + menuWidth > window.innerWidth) {
            x = rect.left - menuWidth;
        }

        setMenuPos({ x, y });
        setPendingParentId(item.type === "folder" ? item.id : null);
        setDeleteItemId(item.id);
    };

    function addItemModal(itemType: "file" | "folder") {
        setIsAddModalOpen(true);
        setNewItemType(itemType);
        
    }

    function deleteItemModal() {
        setIsDeleteModalOpen(true);
    }

    function renameItemModal() {
        const itemToRename = itemLookup.get(deleteItemId!);
        if (itemToRename) {
            setNewItemName(itemToRename.name);
            setNewItemType(itemToRename.type);
            setIsRenameModalOpen(true);
        }
    }

    const handleNameChange = (name: string) => {
        setNewItemName(name);

        const parentId = isRenameModalOpen 
            ? (itemLookup.get(deleteItemId!)?.parent ?? null)
            : pendingParentId;
        
        const isDuplicate = isNameDuplicate(name, parentId, isRenameModalOpen ? deleteItemId! : undefined);

        if (isDuplicate) {
            setModalError("A file or folder with this name already exists. Please choose a different name.");
        } else {
            setModalError("");
        }
    };

    const [consoleHeight, setConsoleHeight] = useState(150);
    const [isConsoleOpen, setIsConsoleOpen] = useState(true);
    const [logs, setLogs] = useState<string[]>(["Project initialized...", "Welcome to the editor!","Project initialized...", "Welcome to the editor!","Project initialized...", "Welcome to the editor!","Project initialized...", "Welcome to the editor!","Project initialized...", "Welcome to the editor!","Project initialized...", "Welcome to the editor!","Project initialized...", "Welcome to the editor!","Project initialized...", "Welcome to the editor!","Project initialized...", "Welcome to the editor!", "Project initialized...", "Welcome to the editor!"]);

     /*
    Function to resize the sidebar on mouse down event.
    */
    const handleConsoleResize = (e: React.MouseEvent) => {
        const startHeight = consoleHeight;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const delta = e.clientY - moveEvent.clientY
            const newHeight = Math.min(Math.max(startHeight + delta, 40), 500);
            setConsoleHeight(newHeight);
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

    };

    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    
    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];
        
        return Array.from(itemLookup.values()).filter(item => 
            item.type === "file" && 
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 8);
    }, [searchQuery, itemLookup]);

    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
                e.preventDefault();
                setIsCommandPaletteOpen(prev => !prev);
                setSearchQuery("");
            }

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
                e.preventDefault();
                setIsConsoleOpen(prev => !prev);
            }

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
                e.preventDefault();
                setIsSidebarVisible(prev => !prev);
            }

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                e.preventDefault();
                setIsSaving(true);
                setTimeout(() => setIsSaving(false), 800);
                setLogs(prev => [...prev, `Saved project at ${new Date().toLocaleTimeString()}`]);
            }

            if (e.ctrlKey && e.key.toLowerCase() === 'n') {
                e.preventDefault();
                e.stopImmediatePropagation();
                setNewItemType("file");
                setIsAddModalOpen(true);
                setPendingParentId(activeFolderId);
            }

            if (e.key === 'Escape') {
                setIsCommandPaletteOpen(false);
                setMenuPos(null);
                setIsAddModalOpen(false);
                setIsDeleteModalOpen(false);
                setIsRenameModalOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown, { capture: true });
        
        return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
    }, [activeFolderId]);

    function handleOpenTab(itemId: number) {
        const path = getPath(itemId);
        
        path.forEach(id => {
            if (!expandedIds.includes(id)){
                handleExpandedIds(id);
            }
        }) 
        
        handleOpenedId(itemId);
    }

    return (
        <>
            {isLoading && (
                <div className="h-screen w-full flex items-center justify-center bg-ide-bg text-white">Joining Room...</div>
            )}

            {menuPos !== null ?
            <ContextMenu x={menuPos.x} y={menuPos.y} selectType={pendingParentId ? "folder" : "file"} onClose={() => setMenuPos(null)} onNewFile={() => addItemModal("file")}
                            onNewFolder={() => addItemModal("folder")} onDelete={deleteItemModal} onRename={renameItemModal}/>
            : null}

            <Modal
                isOpen={isAddModalOpen} 
                onClose={() => {setModalError(""); setIsAddModalOpen(false); setNewItemName("")}}
                title={ `Create New ${newItemType}` }
            >
                <form 
                    onSubmit={(e) => {
                        e.preventDefault();
                        addNewItem(newItemName);
                    }}
                    className="flex flex-col gap-4">

                    <input
                        autoFocus
                        type="text"
                        className={`bg-[#2A2A2A] border border-zinc-600 p-2 rounded text-white outline-none focus:border-ide-accent ${modalError ? "border-red-500 focus:border-red-500" : "border-zinc-600"}`}
                        placeholder={newItemType === "file" ? "Eg: main.ts" : "Eg: src"}
                        value={newItemName}
                        onChange={(e) => handleNameChange(e.target.value)}
                    />

                    {/*  Real-time Error Message */}
                    {modalError && (
                        <span className="text-red-500 text-xs font-medium">{modalError}</span>
                    )}

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="text-zinc-400 hover:text-white px-3"
                            onClick={() => {setIsAddModalOpen(false); setNewItemName("")}}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!!modalError || !newItemName.trim()}
                            className={`px-4 py-2 rounded transition-all
                                ${(!!modalError || !newItemName.trim())
                                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50"
                                    : "bg-[#DC26268e] hover:bg-ide-accent text-white cursor-pointer"
                                }`}>
                            Create
                        </button>
                    </div>
                </form>
                      
            </Modal>
            
            <Modal
                isOpen={isRenameModalOpen} 
                onClose={() => {setModalError(""); setIsRenameModalOpen(false); setNewItemName("")}}
                title={ `Rename ${newItemType}` }
            >
                <form 
                    onSubmit={(e) => {
                        e.preventDefault();
                        renameItem(newItemName);
                    }}
                    className="flex flex-col gap-4">

                    <input
                        autoFocus
                        type="text"
                        className={`bg-[#2A2A2A] border border-zinc-600 p-2 rounded text-white outline-none focus:border-ide-accent ${modalError ? "border-red-500 focus:border-red-500" : "border-zinc-600"}`}
                        placeholder={newItemType === "file" ? "Eg: main.ts" : "Eg: src"}
                        value={newItemName}
                        onChange={(e) => handleNameChange(e.target.value)}
                    />

                    {/*  Real-time Error Message */}
                    {modalError && (
                        <span className="text-red-500 text-xs font-medium">{modalError}</span>
                    )}

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="text-zinc-400 hover:text-white px-3"
                            onClick={() => {setIsRenameModalOpen(false); setNewItemName("")}}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!!modalError || !newItemName.trim()}
                            className={`px-4 py-2 rounded transition-all
                                ${(!!modalError || !newItemName.trim())
                                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50"
                                    : "bg-[#DC26268e] hover:bg-ide-accent text-white cursor-pointer"
                                }`}>
                            Rename
                        </button>
                    </div>
                </form>
                      
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)}
                title={ `Are you sure you want to delete ${deleteItemId !== null ? itemLookup.get(deleteItemId)?.name : ""}?` }
            >
                <form 
                    onSubmit={(e) => {
                        e.preventDefault();
                        deleteItem(deleteItemId!);
                    }}
                    className="flex flex-col gap-4">

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="text-zinc-400 hover:text-white px-3"
                            onClick={cancelDelete}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-[#DC26268e] hover:bg-ide-accent text-white px-4 py-2 rounded"
                        >
                            Delete
                        </button>
                    </div>
                </form>
                      
            </Modal>

            <div className="grid grid-rows-[48px_1fr] h-screen w-full overflow-hidden">

                {/* Top Navbar */}
                <Navbar 
                    isSaving={isSaving} 
                    setIsCommandPaletteOpen={setIsCommandPaletteOpen}
                    isSidebarVisible={isSidebarVisible} 
                    setIsSidebarVisible={setIsSidebarVisible}
                    isConsoleOpen={isConsoleOpen}
                    setIsConsoleOpen={setIsConsoleOpen}
                />

                <div className="h-full w-full flex overflow-hidden relative">
                    <div 
                    style={{ 
                        width: isSidebarVisible ? `${sidebarWidth}%` : '0px',
                        opacity: isSidebarVisible ? 1 : 0 
                    }} 
                    className={`h-full shrink-0 overflow-hidden border-r border-ide-border 
                        ${isResizing ? "" : "transition-all duration-300 ease-in-out"}`}
                    >
                        <FileSidebar data={data} menuPos={menuPos} handleContextMenu={handleContextMenu} pendingParentId={pendingParentId} setPendingParentId={setPendingParentId} newItemType={newItemType} setNewItemType={setNewItemType} isAddModalOpen={isAddModalOpen} setIsAddModalOpen={setIsAddModalOpen} addItemToData={addItemToData} openedId={openedId} handleOpenedId={handleOpenedId}
                                    openedFileTabsId={openedFileTabsId} handleOpenedFileTabsId={handleOpenedFileTabsId}
                                    expandedIds={expandedIds} handleExpandedIds={handleExpandedIds} itemLookup={itemLookup} deleteItemId={deleteItemId} setDeleteItemId={setDeleteItemId} isDeleteModalOpen={isDeleteModalOpen} setIsDeleteModalOpen={setIsDeleteModalOpen} isSidebarVisible={isSidebarVisible} activeFolderId={activeFolderId} setActiveFolderId={setActiveFolderId} isResizing={isResizing}/>
                    </div>

                    {/* Sidebar Resize Gutter */}
                    {isSidebarVisible && (
                    <div className="relative w-1 h-full bg-[#1e1e1e] hover:bg-[#DC26268E] active:bg-ide-accent cursor-col-resize transition-colors shrink-0 group"
                            onMouseDown={handleMouseDown}>

                        <div className="absolute inset-y-0 -left-1 -right-1 cursol-col-resize z-10"/>
                    </div>
                    )}
                    
                    <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
                    {isResizing && (
                        <div className="absolute inset-0 z-100 cursor-col-resize bg-transparent" />
                    )}

                        {/* Editor Section */}
                        <div className="flex-1 min-h-0 overflow-hidden">
                            <CodeEditor data={data} getPath={getPath} handleOpenTab={handleOpenTab} isSaving={isSaving} setIsSaving={setIsSaving} updateFileContent={debouncedUpdate} addItemToData={addItemToData} openedId={openedId} handleOpenedId={handleOpenedId}
                            openedFileTabsId={openedFileTabsId} handleOpenedFileTabsId={handleOpenedFileTabsId}
                            expandedIds={expandedIds} handleExpandedIds={handleExpandedIds} itemLookup={itemLookup}/>
                        </div>

                        {/* Console Section */}
                        {isConsoleOpen && (
                            <div className="flex flex-col shrink-0">
                                {/* Console Resize Gutter */}
                                <div
                                    onMouseDown={handleConsoleResize}
                                    className="h-1 w-full bg-[#1E1E1E] hover:bg-[#DC26268E] active:bg-ide-accent cursor-row-resize transitoon-colors z-20"
                                />
                                    <OutputConsole 
                                        logs={logs}
                                        height={consoleHeight}
                                        onClear={() => setLogs([])}
                                        onClose={() => setIsConsoleOpen(false)}
                                    />
                            </div>
                        )}  
                    </div>

                </div> 
            </div>
        
            <CommandPalette 
                isOpen={isCommandPaletteOpen}
                onClose={() => { setIsCommandPaletteOpen(false); setSearchQuery(""); }}
                query={searchQuery}
                setQuery={setSearchQuery}
                results={searchResults}
                onSelect={(id) => {handleOpenedId(id); handleOpenedFileTabsId(id); handleOpenTab(id);}}
                getPath={getPath}
                itemLookup={itemLookup}
            />
            
        </>
    )
}