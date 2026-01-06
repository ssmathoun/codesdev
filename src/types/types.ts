export interface folderStructureData {
    id: number;
    name: string;
    type: 'file' | 'folder';
    parent?: number | null;
    content?: string;
    children?: folderStructureData[];
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export interface ContextMenuProps {
    x: number;
    y: number;
    selectType: 'file' | 'folder';
    onClose: () => void;
    onNewFile: () => void;
    onNewFolder: () => void;
    onDelete: () => void;
    onRename: () => void;
}
