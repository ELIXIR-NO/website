export default function ProjectCard({project, title, children}) {
    return (
        <li className="break-inside-avoid mb-4"
            data-keywords={project.keywords.join(',')}
            data-category={project.category}
            data-status={project.status}>
            <div className="overflow-hidden bg-white shadow-lg sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h1 className="font-bold text-xl">{title}</h1>
                    <div className="mt-2">{children}</div>
                </div>
            </div>
        </li>
    )
}
