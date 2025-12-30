import { useCallback, useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import CodeEditor from "../components/CodeEditor"
import FileSidebar from "../components/FileSidebar"
import type { folderStructureData } from "../types/types";
import Modal from "../components/Modal";

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
    }
    
    const [sidebarWidth, setSidebarWidth] = useState("15"); // Tracks FileSidebar Width
    const [openedId, setOpenedId] = useState<number | null>(null); // Tracks Open File/Folder IDs
    const handleOpenedId = (id: number) => {
        if (itemLookup.get(id)?.type === "file") {
            setOpenedId(id);
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

    const [expandedIds, setExpandedIds] = useState<number[]>([]);
    const handleExpandedIds = (id: number) => {
        if (itemLookup.get(id)?.type === "folder") {
            setExpandedIds(prev => prev.includes(id) ? prev.filter(currentId => currentId !== id) : [...prev, id]);
        }
    }

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [newItemName, setNewItemName] = useState("");
    const [newItemType, setNewItemType] = useState(null as "file" | "folder" | null);

    const debouncedUpdate = useCallback(
        debounce((id: number, content: string) => {
            updateFileContent(id, content);
        }, 500),
        [data]
    );

    useEffect(() => {
        return () => {
            debouncedUpdate.cancel();
        };
    }, [debouncedUpdate]);

    const addNewItem = (itemName: string) => {
        const trimmedName = itemName.trim();
        if (trimmedName === "" || newItemType === null) {
            return;
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

        setNewItemType(null);
        setOpenedId(newItemId);
        setNewItemName("");
        setIsAddModalOpen(false);
        setPendingParentId(null);
    };

    const deleteItem = (deleteItemId: number) => {
        const itemToDelete = itemLookup.get(deleteItemId);
        if (!itemToDelete) return;

        deleteItemFromData(itemToDelete);
        setDeleteItemId(null);
        setIsDeleteModalOpen(false);

        if (itemToDelete.type === "file") {
            handleOpenedFileTabsId(deleteItemId, true);
        }
        else {
            const collectFileIds = (item: folderStructureData): number[] => {
                let fileIds: number[] = [];
                if (item.type === "file") {
                    fileIds.push(item.id);
                }
                else if (item.children) {
                    item.children.forEach(child => {
                        fileIds = fileIds.concat(collectFileIds(child));
                    })
                }
                return fileIds;
            }

            const fileIdsToClose = collectFileIds(itemToDelete);
            setOpenedFileTabsId(prev => prev.filter(id => !fileIdsToClose.includes(id)));
        }
        setExpandedIds(prev => prev.filter(id => id !== deleteItemId));
        setOpenedId(null);
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
    };

    const [pendingParentId, setPendingParentId] = useState<number | null>(null);

    /*
    Function to resize the sidebar on mouse down event.
    */
    const handleMouseDown = () => {
        const handleMouseMove = (moveEvent: MouseEvent) => {
            const newWidth = (moveEvent.clientX / window.innerWidth) * 100;
            setSidebarWidth(newWidth.toString())
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

    };

    return (
        <>
            <Modal
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)}
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
                        className="bg-[#2A2A2A] border border-zinc-600 p-2 rounded text-white outline-none focus:border-[#DC2626]"
                        placeholder={newItemType === "file" ? "Eg: main.ts" : "Eg: src"}
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="text-zinc-400 hover:text-white px-3"
                            onClick={() => setIsAddModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-[#DC26268e] hover:bg-[#DC2626] text-white px-4 py-2 rounded">
                            Create
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
                            className="bg-[#DC26268e] hover:bg-[#DC2626] text-white px-4 py-2 rounded"
                        >
                            Delete
                        </button>
                    </div>
                </form>
                      
            </Modal>

            <div className="grid grid-rows-[48px_1fr] h-screen w-full">

                {/* Top Navbar */}
                <nav className="flex bg-[#DC2626] text-white"></nav>

                <div className="h-full flex">
                    <FileSidebar data={data} pendingParentId={pendingParentId} setPendingParentId={setPendingParentId} newItemType={newItemType} setNewItemType={setNewItemType} isAddModalOpen={isAddModalOpen} setIsAddModalOpen={setIsAddModalOpen} addItemToData={addItemToData} width={sidebarWidth} openedId={openedId} handleOpenedId={handleOpenedId}
                                    openedFileTabsId={openedFileTabsId} handleOpenedFileTabsId={handleOpenedFileTabsId}
                                    expandedIds={expandedIds} handleExpandedIds={handleExpandedIds} itemLookup={itemLookup} deleteItemId={deleteItemId} setDeleteItemId={setDeleteItemId} isDeleteModalOpen={isDeleteModalOpen} setIsDeleteModalOpen={setIsDeleteModalOpen}/>

                    {/* Resize Gutter */}
                    <div className="w-1 h-screen bg-[#1e1e1e] active:bg-blue-500 cursor-col-resize"
                            onMouseDown={handleMouseDown}></div>

                    <div className="flex-1">
                        <CodeEditor data={data} updateFileContent={debouncedUpdate} addItemToData={addItemToData} openedId={openedId} handleOpenedId={handleOpenedId}
                        openedFileTabsId={openedFileTabsId} handleOpenedFileTabsId={handleOpenedFileTabsId}
                        expandedIds={expandedIds} handleExpandedIds={handleExpandedIds} itemLookup={itemLookup}/>
                    </div>

                </div>
            </div>
            
        </>
    )
}