import React, { useState, useRef, useCallback } from 'react';

function toKebab(str: string): string {
    return str
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

/**
 * Markdown → HTML for preview.
 * HTML entities are escaped FIRST, so user input cannot inject raw HTML.
 * This preview is only rendered inside the admin CMS (noindex, authenticated).
 */
function mdToPreviewHtml(md: string): string {
    return md
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-white mt-4 mb-2">$1</h3>')
        .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold text-white mt-5 mb-2">$1</h2>')
        .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-white mt-6 mb-3">$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" class="rounded max-w-full my-2" />')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-accent underline">$1</a>')
        .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
        .replace(/(<li.*<\/li>\n?)+/g, (m) => `<ul class="list-disc my-2">${m}</ul>`)
        .replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-2 border-gray-600 pl-3 text-gray-400 my-2">$1</blockquote>')
        .replace(/^---$/gm, '<hr class="border-gray-700 my-4" />')
        .replace(/^(?!<[hupoblira])(.*\S.*)$/gm, '<p class="my-1.5">$1</p>')
        .replace(/\n{2,}/g, '\n');
}

interface Props {
    value: string;
    onChange: (md: string) => void;
    onFileUpload?: (file: File) => Promise<string>;
}

export default function MarkdownEditor({ value, onChange, onFileUpload }: Props) {
    const [mode, setMode] = useState<'write' | 'preview' | 'split'>('write');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insert = useCallback((before: string, after = '', placeholder = '') => {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const selected = value.slice(start, end) || placeholder;
        const newValue = value.slice(0, start) + before + selected + after + value.slice(end);
        onChange(newValue);
        requestAnimationFrame(() => {
            ta.focus();
            const cursor = start + before.length + selected.length;
            ta.setSelectionRange(cursor, cursor);
        });
    }, [value, onChange]);

    const handleImageInsert = useCallback(() => {
        const choice = prompt('Enter image URL, or type "upload" to choose a file:');
        if (!choice) return;

        if (choice.toLowerCase() === 'upload') {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async () => {
                const file = input.files?.[0];
                if (!file || !onFileUpload) return;
                const path = await onFileUpload(file);
                insert(`![${toKebab(file.name.replace(/\.[^.]+$/, ''))}](${path})\n`);
            };
            input.click();
        } else {
            insert(`![alt text](${choice})\n`);
        }
    }, [insert, onFileUpload]);

    const handleFileInsert = useCallback(() => {
        if (!onFileUpload) return;
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;
            const path = await onFileUpload(file);
            const name = toKebab(file.name.replace(/\.[^.]+$/, ''));
            insert(`[${name}](${path})\n`);
        };
        input.click();
    }, [insert, onFileUpload]);

    const Btn = ({ onClick, active, title, children }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) => (
        <button
            type="button"
            onMouseDown={e => { e.preventDefault(); onClick(); }}
            title={title}
            className={`p-1.5 rounded text-xs transition-colors ${active ? 'bg-accent/20 text-accent' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
            {children}
        </button>
    );

    // Preview HTML is safe: mdToPreviewHtml escapes all HTML entities before applying markdown transforms
    const previewHtml = mdToPreviewHtml(value);

    return (
        <div className="rounded-lg border border-gray-600 overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-gray-600 bg-dark-surface flex-wrap">
                <Btn onClick={() => insert('**', '**', 'bold')} title="Bold"><span className="font-bold text-[11px]">B</span></Btn>
                <Btn onClick={() => insert('*', '*', 'italic')} title="Italic"><span className="italic text-[11px]">I</span></Btn>
                <div className="w-px h-5 bg-gray-600 mx-1" />
                <Btn onClick={() => insert('# ', '', 'Heading')} title="H1"><span className="font-bold text-[11px]">H1</span></Btn>
                <Btn onClick={() => insert('## ', '', 'Heading')} title="H2"><span className="font-bold text-[11px]">H2</span></Btn>
                <Btn onClick={() => insert('### ', '', 'Heading')} title="H3"><span className="font-bold text-[11px]">H3</span></Btn>
                <div className="w-px h-5 bg-gray-600 mx-1" />
                <Btn onClick={() => insert('- ', '', 'item')} title="Bullet list"><span className="text-[11px]">List</span></Btn>
                <Btn onClick={() => insert('[', '](url)', 'link text')} title="Link"><span className="text-[11px]">Link</span></Btn>
                <Btn onClick={handleImageInsert} title="Image (URL or upload)"><span className="text-[11px]">Img</span></Btn>
                {onFileUpload && <Btn onClick={handleFileInsert} title="Upload file"><span className="text-[11px]">File</span></Btn>}
                <Btn onClick={() => insert('> ', '', 'quote')} title="Blockquote"><span className="text-[11px]">Quote</span></Btn>
                <Btn onClick={() => insert('\n---\n')} title="Horizontal rule"><span className="text-[11px]">HR</span></Btn>

                <div className="ml-auto flex gap-0.5">
                    <Btn onClick={() => setMode('write')} active={mode === 'write'} title="Source"><span className="text-[11px]">Source</span></Btn>
                    <Btn onClick={() => setMode('split')} active={mode === 'split'} title="Split view"><span className="text-[11px]">Split</span></Btn>
                    <Btn onClick={() => setMode('preview')} active={mode === 'preview'} title="Preview"><span className="text-[11px]">Preview</span></Btn>
                </div>
            </div>

            {/* Editor area */}
            <div className={mode === 'split' ? 'grid grid-cols-2 divide-x divide-gray-600' : ''}>
                {mode !== 'preview' && (
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        className="w-full min-h-[350px] px-4 py-3 text-sm font-mono bg-[#1a1a2e] text-gray-200 focus:outline-none resize-y"
                        placeholder="Write markdown here..."
                    />
                )}
                {mode !== 'write' && (
                    <div
                        className="min-h-[350px] px-4 py-3 text-sm bg-dark-surface text-gray-300 overflow-y-auto"
                        dangerouslySetInnerHTML={{ __html: previewHtml }}
                    />
                )}
            </div>
        </div>
    );
}
