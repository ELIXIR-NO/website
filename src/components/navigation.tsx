import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/24/outline'
import React, { Fragment, useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import CommandPalette from "./command-palette.tsx";
import ThemeToggle from "./theme-toggle.tsx";

const BASE = import.meta.env.BASE_URL;

const navigation = [
    {
        href: `${BASE}about`,
        name: "About",
        sections: [
            { id: "organization", name: "Organization" },
            { id: "funding-and-projects", name: "Funding & Projects" },
            { id: "impact", name: "Impact" },
            { id: "international-collaboration", name: "International Collaboration\n" },
        ]
    },
    { href: `${BASE}research-support`, name: "Research Support" },
    { href: `${BASE}services`, name: "Services" },
    { href: `${BASE}events`, name: "Events" },
    { href: `${BASE}training`, name: "Training" },
    { href: `${BASE}funding-and-projects`, name: "Funding & Projects" },
    { href: `${BASE}news`, name: "News" },
];

export const Navigation = ({ pathname }) => {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [open, setOpen] = useState(false);

    // If context menu is needed.
    // const [sections, setSections] = useState([]);
    // <ContextualHeader sections={sections}/>
    // useEffect(() => {
    //     const ref = navigation.find(x => x.href === pathname);
    //     if (ref && ref.sections) {
    //         setSections(ref.sections)
    //     }
    // }, [pathname]);

    useEffect(() => {
        console.log(pathname);
    }, [ pathname])

    const onSearchClick = () => {
        setOpen(true);
    };

    return (
        <Fragment>
            <header className="relative inset-x-0 top-0 z-50 ">
                <nav aria-label="Global"
                     className="sticky max-w-full 2xl:max-w-[90%] top-0 z-50 flex items-center justify-between pb-6 px-6 pt-6 lg:pb-0 lg:px- mx-auto">
                    <CommandPalette {...{ open, setOpen }} />
                    <div className="flex lg:flex-1">
                        <a href={BASE} className="-m-1.5 p-1.5">
                            <span className="sr-only">ELIXIR Norway</span>
                            <img
                                alt="ELIXIR Norway logo"
                                src={`${BASE}assets/logos/elixir-no-light.svg`}
                                className="hidden dark:block h-20 w-auto"
                                width="auto"
                                height="80"
                            />
                            <img
                                alt="ELIXIR Norway logo"
                                src={`${BASE}assets/logos/elixir-no-dark.svg`}
                                className="block dark:hidden h-20 w-auto"
                                width="auto"
                                height="80"
                            />
                        </a>
                    </div>
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Open main menu"
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="h-6 w-6"/>
                        </button>
                    </div>
                    <div className="hidden lg:flex lg:gap-x-12">
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className={`hover:text-brand-primary/75 text-lg font-semibold leading-6 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 rounded ${pathname === item.href ? 'text-brand-primary' : 'text-gray-900 dark:text-white'}`}
                                aria-current={pathname === item.href ? 'page' : undefined}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                    <div className="hidden lg:flex gap-x-2 lg:flex-1 lg:justify-end">
                        <ThemeToggle/>
                        <button onClick={onSearchClick} aria-label="Search">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
                            </svg>
                        </button>
                    </div>
                </nav>
                <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden" >
                    <div className="fixed inset-0 z-50"/>
                    <DialogPanel
                        className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                        <div className="flex items-center justify-between">
                            <a href={BASE} className="-m-1.5 p-1.5">
                                <span className="sr-only">ELIXIR Norway</span>
                                <img
                                    alt="ELIXIR Norway logo"
                                    src={`${BASE}assets/logos/elixir-no-light.svg`}
                                    className="hidden dark:block h-16 w-auto"
                                    width="auto"
                                    height="80"
                                />
                                <img
                                    alt="ELIXIR Norway logo"
                                    src={`${BASE}assets/logos/elixir-no-dark.svg`}
                                    className="block dark:hidden h-16 w-auto"
                                    width="auto"
                                    height="80"
                                />
                            </a>
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-center"
                                aria-label="Close menu"
                            >
                                <span className="sr-only">Close menu</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
                                </svg>
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="space-y-2 py-6">
                                    {navigation.map((item) => (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        >
                                            {item.name}
                                        </a>
                                    ))}
                                </div>
                                <div className="py-6">
                                    <button
                                        onClick={onSearchClick}
                                        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-colors"
                                        aria-label="Open search"
                                    >
                                        <IoSearch className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </Dialog>
            </header>
        </Fragment>
    );

};

export default Navigation;
