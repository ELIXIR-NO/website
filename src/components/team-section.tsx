import type { FunctionComponent, PropsWithChildren } from "react";
import React from "react";

const BASE = import.meta.env.BASE_URL;

type TeamSectionComponent = FunctionComponent<PropsWithChildren<{
    title?: string,
    layout?: "relaxed" | "compact"
}>> & {
    Member: typeof Member;
};

const TeamSection: TeamSectionComponent = ({ title, children, layout = "relaxed" }) => {
    return (
        <section className="mx-auto max-w-7xl">
            {title && (
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{title}</h2>
                </div>
            )}
            <ul role="list"
                className={`list-none mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-y-14 sm:grid-cols-3 lg:mx-0 ${layout === "compact" ? "text-center sm:grid-cols-6 md:grid-cols-6 lg:max-w-none lg:grid-cols-6 xl:grid-cols-6 gap-x-4" : "gap-x-4 lg:max-w-none xl:grid-cols-5"}`}>
                {children}
            </ul>
        </section>
    );
};

const Member = ({ name, title, organization, displayOrgLogo = true, photo, hidePhoto }) => {

    const resolveMemberOrgImageAsset = () => {
        switch (organization) {
            case "UIT":
                return "uit.svg";
            case "UIO":
                return "uio.svg";
            case "UIB":
                return "uib.svg";
            case "NMBU":
                return "nmbu.svg";
            case "NTNU":
                return "ntnu.svg";
        }
    };

    const resolveOrgCssShape = () => {
        switch (organization) {
            case "NMBU":
                return "rounded rounded-tl-3xl rounded-br-3xl";
            case "NTNU":
                return "rounded-lg";
            default:
                return "rounded-full";
        }
    };

    const MemberOrgLogo = (
        <div
            className={`absolute w-12 p-0.5 ${resolveOrgCssShape()} bottom-2 right-2 overflow-hidden bg-white border-2 border-white`}>
            <img
                src={`${BASE}assets/logos/orgs/${resolveMemberOrgImageAsset()}`}
                alt="Organization Logo"
                className="w-full h-full object-contain"
            />
        </div>
    );

    return (
        <li className="relative p-0 m-0 indent-0">
            {!hidePhoto && <div className="relative">
                <img
                    className="w-full rounded-2xl aspect-[6/6] object-cover"
                    src={photo ?? `${BASE}assets/placeholders/person.png`}
                    alt={name}
                />
                {organization && displayOrgLogo ? MemberOrgLogo : null}
            </div>}
            <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">
                {name}
            </h3>
            <div className="flex flex-col">
                {title && (
                    <p className="text-base text-gray-600">{title}</p>
                )}
                {organization && (
                    <p className="text-sm leading-6 text-gray-500">{organization}</p>
                )}
            </div>
        </li>
    );
};

TeamSection.Member = Member;

export default TeamSection;
