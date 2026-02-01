import type { ContextMenuProps } from "../../types/types";
import { createPortal } from 'react-dom';

export default function ContextMenu({x, y, selectType, onClose, onNewFile, onNewFolder, onDelete, onRename}: ContextMenuProps) {
    return createPortal(
        <div className="fixed inset-0 z-40 font-sans text-[14px]" onClick={onClose}>
            <div
                className="fixed z-50 bg-[#252525] border border-zinc-700 shadow-xl rounded py-1 text-zinc-300"
                style={{ top: y, left: x, width: '140px' }}
                onClick={(e) => e.stopPropagation()}
            >
                {selectType === "folder" ?
                <button
                    onClick={() => { onNewFile(); onClose(); }}
                    className="w-full text-left px-4 py-1.5 hover:bg-[#37373d] transition-colors"
                >
                    New File
                </button>
                : null}

                {selectType === "folder" ?
                <>
                    <button
                        onClick={() => { onNewFolder(); onClose(); }}
                        className="w-full text-left px-4 py-1.5 hover:bg-[#37373d] transition-colors"
                    >
                        New Folder
                    </button>

                    <div className="my-1 border-t border-zinc-700" />
                </>
                : null}

                <button
                    onClick={() => { onRename(); onClose(); }}
                    className="w-full text-left px-4 py-1.5 hover:bg-[#37373d] transition-colors"
                >
                    Rename
                </button>

                <button
                    onClick={() => { onDelete(); onClose(); }}
                    className="w-full text-left px-4 py-1.5 hover:bg-[#37373d] transition-colors"
                >
                    Delete
                </button>

            </div>
        </div>,
        document.body
    );
}