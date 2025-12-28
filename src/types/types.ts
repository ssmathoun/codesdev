export default interface folderStructureData {
    id: number;
    name: string;
    type: 'file' | 'folder';
    parent?: number | null;
    content?: string;
    children?: folderStructureData[];
}