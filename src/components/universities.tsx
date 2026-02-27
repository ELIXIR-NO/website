import React from "react";

const Universities = () => {
    return (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5 place-content-center">
            <Entry
                src="/assets/logos/orgs/uib.svg"
                alt="University of Bergen"
                location="Bergen"
                href="/about/bergen"/>
            <Entry
                src="/assets/logos/orgs/uio.svg"
                alt="University of Oslo"
                location="Oslo"
                href="/about/oslo"/>
            <Entry
                src="/assets/logos/orgs/uit.svg"
                alt="The Arctic University of Norway"
                location="Tromsø"
                href="/about/tromso"/>
            <Entry
                src="/assets/logos/orgs/nmbu.svg"
                alt="Norwegian University of Life Sciences"
                location="Ås"
                href="/about/aas"/>
            <Entry
                src="/assets/logos/orgs/ntnu.svg"
                alt="Norwegian University of Science and Technology"
                location="Trondheim"
                href="/about/trondheim"/>
        </div>
    );
}

const Entry = ({ src, alt, location, href }) => {
    return (
        <a
            href={href}
            className="text-gray-900 hover:text-gray-800 relative overflow-hidden p-4 flex flex-col gap-y-4 items-center justify-between hover:scale-105 hover:opacity-50 transition-all delay-75">
            <div className={`w-28 h-28 overflow-hidden`}>
                <img
                    src={src}
                    alt={alt + " logo"}
                    className="w-full h-full invert-25 dark:invert-85 object-contain hover:scale-95 hover:opacity-75 transition-all delay-75"
                />
            </div>
            <p className="font-medium text-lg">{location}</p>
        </a>
    );
};

export default Universities;
