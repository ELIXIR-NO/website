import type { ReactNode } from "react";

export type CardTypeProps = {
    title: string;
    icon?: any;
    children?: ReactNode;
    margin?: boolean;
    className?: string;
}

export default function Card({ title, icon: Icon, children, margin = true, className = "" }: CardTypeProps) {
    return (
        <div className={`${margin ? "my-8" : ''} rounded-xl border border-gray-200/60 dark:border-gray-700/30 bg-white dark:bg-white/[0.03] ${className}`}>
            <div className="px-5 py-4 border-b border-gray-200/60 dark:border-gray-700/30 flex gap-x-3 items-center">
                {Icon && <Icon className="w-5 h-5 text-brand-secondary-text dark:text-brand-secondary shrink-0"/>}
                <h3 className="font-semibold text-lg text-brand-primary dark:text-white">{title}</h3>
            </div>
            <div className="px-5 py-4 text-sm leading-relaxed text-brand-grey dark:text-gray-300 [&_p]:text-sm [&_p]:leading-relaxed [&_p:first-child]:mt-0 [&_p:last-child]:mb-0">
                {children}
            </div>
        </div>
    )
}
