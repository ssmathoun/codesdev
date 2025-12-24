
const data = [
    { id: 1, name: 'index.tsx', type: 'file' },
    { id: 2, name: 'App.tsx', type: 'file' },
    { id: 3, name: 'components', type: 'folder', children: [
        { id: 4, name: 'Header.tsx', type: 'file' },
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
            </aside>
        </div>
    )
}
