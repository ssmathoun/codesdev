export default interface folderStructureData {
    id: number;
    name: string;
    type: 'file' | 'folder';
    children?: folderStructureData[];
}