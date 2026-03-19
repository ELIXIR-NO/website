import React, { useState } from 'react';

export interface PRConfirmProps {
    defaultTitle: string;
    defaultDescription: string;
    files: Array<{ path: string }>;
    onConfirm: (title: string, description: string) => void;
    onCancel: () => void;
}

export default function PRConfirmDialog({ defaultTitle, defaultDescription, files, onConfirm, onCancel }: PRConfirmProps) {
    const [title, setTitle] = useState(defaultTitle);
    const [description, setDescription] = useState(defaultDescription);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onCancel}>
            <div className="bg-dark-surface border border-gray-700/30 rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white mb-4">Create Pull Request</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">PR Title</label>
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-600 bg-dark-background text-white focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-600 bg-dark-background text-white focus:outline-none focus:ring-2 focus:ring-accent resize-y"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Files ({files.length})</label>
                        <div className="max-h-32 overflow-y-auto rounded-lg bg-dark-background border border-gray-700/30 px-3 py-2">
                            {files.map((f, i) => (
                                <p key={i} className="text-xs text-gray-400 font-mono truncate">{f.path}</p>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-6 justify-end">
                    <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-600 text-gray-300 hover:bg-white/5 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(title, description)}
                        disabled={!title.trim()}
                        className="px-5 py-2 text-sm font-semibold rounded-lg bg-accent text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        Create PR
                    </button>
                </div>
            </div>
        </div>
    );
}
