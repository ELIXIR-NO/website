import type { ReactNode } from "react";
import {truncateStringToLength} from "../lib/utils.ts";

const BASE = import.meta.env.BASE_URL;

export type CardTypeProps = {
    title: string;
    summary: string;
    link: string;
    cover?: string;
    date?: string;
}

export default function CardV2(props: CardTypeProps) {
    return (
        <li className="shadow-xl bg-light-surface dark:bg-dark-surface rounded-lg overflow-clip transition-all duration-300 hover:shadow-2xl hover:opacity-95">
            <a href={`${props.link}`} className="block">
                <div className="h-48 bg-white overflow-clip flex items-center justify-center">
                    <img src={props?.cover ?? `${BASE}assets/og/default.jpg`}
                         alt={props.title || "Article cover image"}
                         loading="lazy"
                         className="w-auto h-auto"/>
                </div>
                <div className="flex px-6 pt-4 pb-6 flex-col gap-y-2">
                    { props.date && <time className="block font-light">{props.date}</time>}
                    <span className="block text-xl font-bold">{props.title}</span>
                    {props.summary && <span
                        className="block text-sm font-light">{truncateStringToLength(props.summary, 120)}</span>}
                </div>
            </a>
        </li>
    )
}
