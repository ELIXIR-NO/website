import React from 'react';

const variants = {
    info: {
        border: 'border-blue-400 dark:border-blue-500',
        bg: 'bg-blue-50/50 dark:bg-blue-900/10',
        title: 'text-blue-900 dark:text-blue-200',
        text: 'text-blue-800 dark:text-blue-300',
        icon: (
            <svg className="h-5 w-5 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
        ),
    },
    success: {
        border: 'border-green-400 dark:border-green-500',
        bg: 'bg-green-50/50 dark:bg-green-900/10',
        title: 'text-green-900 dark:text-green-200',
        text: 'text-green-800 dark:text-green-300',
        icon: (
            <svg className="h-5 w-5 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        ),
    },
    warn: {
        border: 'border-yellow-400 dark:border-yellow-500',
        bg: 'bg-yellow-50/50 dark:bg-yellow-900/10',
        title: 'text-yellow-900 dark:text-yellow-200',
        text: 'text-yellow-800 dark:text-yellow-300',
        icon: (
            <svg className="h-5 w-5 text-yellow-500 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
        ),
    },
    danger: {
        border: 'border-red-400 dark:border-red-500',
        bg: 'bg-red-50/50 dark:bg-red-900/10',
        title: 'text-red-900 dark:text-red-200',
        text: 'text-red-800 dark:text-red-300',
        icon: (
            <svg className="h-5 w-5 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        ),
    },
};

const Callout = ({ variant = 'info', title, children }) => {
    const v = variants[variant] || variants.info;

    return (
        <div className={`my-6 rounded-lg border-l-4 ${v.border} ${v.bg} px-5 py-4`}>
            <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">{v.icon}</div>
                <div className="min-w-0">
                    {title && <p className={`text-base font-semibold ${v.title}`}>{title}</p>}
                    <div className={`mt-1 text-base leading-relaxed ${v.text} [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-2 [&_p]:text-base [&_p:first-child]:mt-0`}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Callout;
