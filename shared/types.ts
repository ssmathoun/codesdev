export interface folderStructureData {
    id: number;
    name: string;
    type: 'file' | 'folder';
    parent?: number | null;
    content?: string;
    children?: folderStructureData[];
}

export interface Project {
    id: string;
    name: string;
    file_tree: folderStructureData[];
    owner_name?: string;
    created_at?: string;
}

export interface Version {
    id: number;
    label: string;
    created_at: string;
}

export interface Collaborator {
    name: string;
    avatarUrl?: string;
}

// Forces TypeScirpt to treat this file as a module
export {};