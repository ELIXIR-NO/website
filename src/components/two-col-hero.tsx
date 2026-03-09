import type { FunctionComponent, PropsWithChildren } from "react";
import React from "react";

type LandingComponent = FunctionComponent<PropsWithChildren> & {
    Header: typeof Header;
    Description: typeof Description;
    Figure: typeof Figure;
}

const TwoColHero: LandingComponent = ({ children }) => {
    return (
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {children}
        </div>
    );
};

const Header = ({ children }: PropsWithChildren) => (
    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-brand-primary dark:text-white leading-[1.15] text-balance [&_a]:text-brand-secondary [&_a]:no-underline [&_a]:hover:underline [&_a]:underline-offset-4">
        {children}
    </h1>
);
TwoColHero.Header = Header;

const Description = ({ children }: PropsWithChildren) => (
    <div className="mt-6 lg:mt-0 lg:col-start-1 lg:row-start-2">
        <p className="text-base sm:text-lg leading-relaxed text-brand-grey dark:text-gray-300 [&_a]:text-brand-secondary [&_a]:no-underline [&_a]:hover:underline [&_a]:underline-offset-4">
            {children}
        </p>
    </div>
);
TwoColHero.Description = Description;

const Figure = ({ src, alt }: { src: string; alt: string }) => (
    <div className="lg:row-span-2">
        <img
            alt={alt}
            src={src}
            className="w-full max-w-lg mx-auto lg:max-w-none rounded-2xl lg:rounded-3xl shadow-lg shadow-black/[0.08] dark:shadow-black/30"
            loading="lazy"
        />
    </div>
);
TwoColHero.Figure = Figure;

export default TwoColHero;
