import type folderStructureData from "../types/types";
import FolderStructure from "./FolderStructure";
import  {FolderPlus, FilePlus}from "lucide-react";

export default function FileSidebar({data, width, openedId, handleOpenedId, openedFileTabsId, handleOpenedFileTabsId, expandedIds, handleExpandedIds, itemLookup}: { data: folderStructureData[], width: string, openedId: number | null, handleOpenedId: (id: number) => void, openedFileTabsId: number[], handleOpenedFileTabsId: (id: number) => void, expandedIds: number[], handleExpandedIds: (id: number) => void, itemLookup: Map<number, folderStructureData>}) {
    return (
        <div className="flex flex-col overflow-hidden select-none cursor-default">
            {/* Sidebar */}
            <aside className="h-screen min-w-[5vw] max-w-[35vw] bg-[#130505] text-white overflow-auto resize-x"
                style={{ width: `${width}vw` }}>   

                <h2 className="my-4 text-center text-xl">project name</h2>
                <div className="flex items-center justify-end mx-2 mb-1 gap-2">
                    <button>
                        <FilePlus size={18} color="grey"/>
                    </button>
                    <button>
                        <FolderPlus size={18} color="grey"/>
                    </button>
                </div>
                <FolderStructure data={data} isIdOpened={openedId} handleIsIdOpened={handleOpenedId}
                openedFileTabsId={openedFileTabsId} handleOpenedFileTabsId={handleOpenedFileTabsId}
                expandedIds={expandedIds} handleExpandedIds={handleExpandedIds} itemLookup={itemLookup}/>
            </aside>
        </div>
    )
}
