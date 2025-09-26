import type { FunctionComponent, PropsWithChildren } from "react";
import React from "react";

type LandingComponent = FunctionComponent<PropsWithChildren> & {
    Header: typeof Header;
    Description: typeof Description;
    Figure: typeof Figure;
}

const TwoColHero: LandingComponent = ({ children }) => {
    return (
        <div
            className="mx-auto min-h-full grid lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
            {children}
        </div>
    );
};

const Header = ({ children }) => (
    <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-6xl lg:col-span-2 xl:col-auto [&_a]:text-brand-primary [&_a]:dark:text-brand-secondary [&_a]:no-underline [&_a]:hover:saturate-150 animate__animated animate__fadeIn">
        {children}
    </h1>
);
TwoColHero.Header = Header;

const Description = ({ children }) => (
    <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1 animate__animated animate__fadeIn">
        <p className="text-lg leading-8 [&_a]:no-underline">
            {children}
        </p>
    </div>
);
TwoColHero.Description = Description;

const Figure = ({ src, alt }) => (
    <img
        alt={alt}
        src={src}
        className="mt-10 lg:mt-0 w-full max-w-xl rounded-2xl sm:mt-16 lg:max-w-none xl:row-span-2 xl:row-end-2 self-center justify-self-center animate__animated animate__fadeIn"
    />
);
TwoColHero.Figure = Figure;

export default TwoColHero;
