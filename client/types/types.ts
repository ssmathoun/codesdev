
import type { folderStructureData, Project, Version, Collaborator } from '../../shared/types';

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

export interface OutputConsoleProps {
    logs: string[];
    onClear: () => void;
    onClose: () => void;
    height: number;
}

export interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    query: string;
    setQuery: (val: string) => void;
    results: folderStructureData[];
    onSelect: (id: number) => void;
    getPath: (id: number) => number[];
    itemLookup: Map<number, folderStructureData>;
}

export type ViewMode = "grid" | "list";

export type Category = "all" | "mine" | "shared-in" | "shared-out";

export interface AuthContextType {
  user: any;
  loading: boolean;
  login: (credentials: any) => Promise<boolean>;
  logout: () => Promise<void>;
}

export type ModalType = 'create' | 'rename' | 'delete' | 'share' | null;

export interface NavbarProps {
    user: { 
        username: string; 
        avatar_id: string; 
        avatar_url?: string; 
    } | null;
    projectId: string | undefined;
    projectName: string;
    isSaving: boolean;
    setIsCommandPaletteOpen: (val: boolean) => void;
    isSidebarVisible: boolean;
    setIsSidebarVisible: (val: boolean) => void;
    isConsoleOpen: boolean;
    setIsConsoleOpen: (val: boolean) => void;
    onCheckpoint: () => void;
}
  
export interface VersionHistoryProps {
    versions: Version[];
    onRevert: (id: number) => void;
    onPreview: (id: number) => void;
    activePreviewId: number | null;
  }