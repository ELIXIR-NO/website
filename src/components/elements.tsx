import React from 'react';
import { FaQuoteLeft } from "react-icons/fa";

export const A: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = (props) => (
    <a {...props}
       rel="noreferrer noopener"
       target="_blank"/>
);

export const UL: React.FC<React.HTMLAttributes<HTMLUListElement>> = ({ children, ...props }) => (
    <ul {...props} className="text-lg list-disc list-inside my-6 space-y-2">
        {children}
    </ul>
);

export const OL: React.FC<React.OlHTMLAttributes<HTMLOListElement>> = ({ children, ...props }) => (
    <ol {...props} className="text-lg list-decimal list-inside my-6 space-y-2">
        {children}
    </ol>
);

export const LI: React.FC<React.LiHTMLAttributes<HTMLLIElement>> = (props) => (
    <li {...props} className="mb-1 pl-12 -indent-6"/>
);

export const H1: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = (props) => (
    <h1 {...props} className="text-4xl font-bold mb-4 scroll-mt-12"/>
);

export const H2: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = (props) => (
    <h2 {...props} className="text-3xl font-semibold mt-8 mb-3 scroll-mt-12"/>
);

export const H3: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = (props) => (
    <h3 {...props} className="text-2xl font-semibold mt-5 mb-2 scroll-mt-12"/>
);

export const H4: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = (props) => (
    <h4 {...props} className="text-xl font-semibold mt-4 mb-2 scroll-mt-12"/>
);

export const H5: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = (props) => (
    <h5 {...props} className="text-lg font-semibold mt-3 mb-2 scroll-mt-12"/>
);

export const H6: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = (props) => (
    <h6 {...props} className="text-base font-semibold mt-3 mb-2 scroll-mt-12"/>
);

export const P: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = (props) => (
    <p {...props} className="text-lg my-6 leading-relaxed [&:last-child]:mb-0 [&:first-child]:mt-0"/>
);

export const PRE: React.FC<React.HTMLAttributes<HTMLPreElement>> = (props) => (
    <pre {...props} className="bg-gray-100 p-4 rounded-md overflow-x-auto my-4"/>
);

export const Figure: React.FC<React.HTMLAttributes<HTMLElement>> = ({ children, ...props }) => (
    <figure {...props} className="my-6">
        {children}
    </figure>
);

// here the `alt` is provided via {...props}
// noinspection HtmlRequiredAltAttribute
export const Img: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => (
    !props.title
        ? <img {...props} className="max-w-full h-auto rounded-md m-auto my-8"/>
        : (
            <figure>
                <img {...props} className="max-w-full h-auto rounded-md m-auto my-8"/>
                <figcaption className="text-slate-400 text-sm italic text-center my-2">{props.title}</figcaption>
            </figure>
        )
);

export const Blockquote: React.FC<React.BlockquoteHTMLAttributes<HTMLQuoteElement>> = ({ children, ...props }) => (
    <blockquote {...props} className="text-lg relative border-l-4 border-gray-300 pl-6 pt-2 my-12">
        <FaQuoteLeft
            className="absolute top-0 left-0 transform -translate-x-3 -translate-y-1/2 text-5xl text-gray-300"/>
        {children}
    </blockquote>
);

export const Hr: React.FC<React.HTMLAttributes<HTMLHRElement>> = (props) => (
    <hr {...props} className="my-8 border-t border-gray-200"/>
);

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({ children, ...props }) => (
    <div className="overflow-x-auto my-6">
        <table {...props} className="min-w-full border-collapse">
            {children}
        </table>
    </div>
);

export const Th: React.FC<React.ThHTMLAttributes<HTMLTableHeaderCellElement>> = (props) => (
    <th {...props} className="bg-gray-100 border border-gray-300 px-4 py-2 text-left font-semibold"/>
);

export const Td: React.FC<React.TdHTMLAttributes<HTMLTableDataCellElement>> = (props) => (
    <td {...props} className="border border-gray-300 px-4 py-2"/>
);

export const Em: React.FC<any> = (props) => (
    <em {...props} className="font-emphasized font-normal text-brand-primary"/>
);

export const Strong: React.FC<any> = (props) => (
    <strong {...props} className="font-bold"/>
);



export const components = {
    a: A,
    ul: UL,
    ol: OL,
    li: LI,
    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,
    h5: H5,
    h6: H6,
    em: Em,
    strong: Strong,
    p: P,
    pre: PRE,
    figure: Figure,
    img: Img,
    blockquote: Blockquote,
    hr: Hr,
    table: Table,
    th: Th,
    td: Td,
}