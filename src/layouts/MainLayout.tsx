import { useMemo, useState } from "react";
import CodeEditor from "../components/CodeEditor"
import FileSidebar from "../components/FileSidebar"
import type folderStructureData from "../types/types";

const dirData: folderStructureData[] = [
    { id: 1, name: 'index.tsx', type: 'file', content: 'index.tsx'},
    { id: 2, name: 'App.tsx', type: 'file', content: 'App.tsx'},
    { id: 3, name: 'components', type: 'folder', parent: null, children: [
        { id: 4, name: 'headerFolder', type: 'folder', parent: 3, children: [
            { id: 9, name: 'Header.tsx', type: 'file', parent: 4,  content: 'Header.tsx'},
            { id: 10, name: 'Logo.tsx', type: 'file', parent: 4, content: 'Logo.tsx'},
        ] },
        { id: 5, name: 'Footer.tsx', type: 'file', parent: 3, content: 'Footer.tsx'},
    ]},
    { id: 6, name: 'styles', type: 'folder', parent: null, children: [
        { id: 7, name: 'main.css', type: 'file', parent: 6, content: 'main.css' },
        { id: 8, name: 'theme.css', type: 'file', parent: 6, content: 'theme.css' },
    ]},
]

export default function MainLayout() {
    const [data, setData] = useState<folderStructureData[]>(dirData);
    const addItemToData = (newItem: folderStructureData, parentId: number | null = null) => {
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
    
    const [sidebarWidth, setSidebarWidth] = useState("15"); // Tracks FileSidebar Width
    const [openedId, setOpenedId] = useState<number | null>(null); // Tracks Open File/Folder IDs
    const handleOpenedId = (id: number) => {
        if (itemLookup.get(id)?.type === "file") {
            setOpenedId(id);
        }
    };
    const [openedFileTabsId, setOpenedFileTabsId] = useState<number[]>(openedId !== null ? [openedId] : []);
    const handleOpenedFileTabsId = (id: number, toggle: boolean = false) => {
        if (toggle) {
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
            <div className="grid grid-rows-[48px_1fr] h-screen w-full">

                {/* Top Navbar */}
                <nav className="flex bg-[#DC2626] text-white"></nav>

                <div className="h-full flex">
                    <FileSidebar data={data} addItemToData={addItemToData} width={sidebarWidth} openedId={openedId} handleOpenedId={handleOpenedId}
                                    openedFileTabsId={openedFileTabsId} handleOpenedFileTabsId={handleOpenedFileTabsId}
                                    expandedIds={expandedIds} handleExpandedIds={handleExpandedIds} itemLookup={itemLookup}/>

                    {/* Resize Gutter */}
                    <div className="w-1 h-screen bg-[#1e1e1e] active:bg-blue-500 cursor-col-resize"
                            onMouseDown={handleMouseDown}></div>

                    <div className="flex-1">
                        <CodeEditor data={data} addItemToData={addItemToData} openedId={openedId} handleOpenedId={handleOpenedId}
                        openedFileTabsId={openedFileTabsId} handleOpenedFileTabsId={handleOpenedFileTabsId}
                        expandedIds={expandedIds} handleExpandedIds={handleExpandedIds} itemLookup={itemLookup}/>
                    </div>

                </div>
            </div>
        </>
    )
}