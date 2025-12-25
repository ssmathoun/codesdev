import type folderStructureData from "../types/types";
import FolderStructure from "./FolderStructure";
import  {FolderPlus, FilePlus}from "lucide-react";

const data: folderStructureData[] = [
    { id: 1, name: 'index.tsx', type: 'file' },
    { id: 2, name: 'App.tsx', type: 'file' },
    { id: 3, name: 'components', type: 'folder', children: [
        { id: 4, name: 'headerFolder', type: 'folder', children: [
            { id: 9, name: 'Header.tsx', type: 'file' },
            { id: 10, name: 'Logo.tsx', type: 'file' },
        ] },
        { id: 5, name: 'Footer.tsx', type: 'file' },
    ]},
    { id: 6, name: 'styles', type: 'folder', children: [
        { id: 7, name: 'main.css', type: 'file' },
        { id: 8, name: 'theme.css', type: 'file' },
    ]},
]

export default function FileSidebar({width}: {width: string}) {
    
    return (
        <div className="flex flex-col overflow-hidden">
            {/* Sidebar */}
            <aside className="h-screen min-w-[5vw] max-w-[35vw] bg-[#130505] text-white overflow-auto resize-x"
                style={{ width: `${width}vw` }}>   

                <h2 className="my-4 text-center text-xl">project name</h2>
                <div className="flex items-center justify-end mx-2 gap-2">
                    <button>
                        <FilePlus size={18}/>
                    </button>
                    <button>
                        <FolderPlus size={18}/>
                    </button>
                </div>
                <FolderStructure data={data}/>
            </aside>
        </div>
    )
}
