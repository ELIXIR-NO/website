import {GrLinkNext} from "react-icons/gr";
import {stringToKebabCase} from "../lib/utils.ts";

export default function ProjectCard({project, title, children, href = "#"}) {
    return (
        <li className="break-inside-avoid mb-4 bg-light-surface dark:bg-dark-surface outline outline-slate-200/75 dark:outline-gray-700/75 rounded-lg cursor-pointer hover:outline-offset-2 transition-all animate__animated animate__fadeIn [>a]:unset"
            data-project={stringToKebabCase(project.title)}
            data-keywords={project.keywords.join(',')}
            data-category={project.category}
            data-status={project.status}
        >
            <a className="![all:unset] block overflow-hidden" href={href} target="_blank">
                <div className="px-4 py-5 sm:p-6">
                    <h1 className="font-bold text-2xl">{title}</h1>
                    <div className="mt-2">{children}</div>
                </div>
            </a>
        </li>
    );
}
