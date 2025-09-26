import { SiFlickr, SiLinkedin, SiYoutube } from "react-icons/si";
import { FaTwitter } from "react-icons/fa";
import React from "react";

const Footer = () => {
    return (
        <footer className="bg-slate-50 py-12 px-4 md:px-12 dark:bg-dark-surface mt-24" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">Footer</h2>
            <div className="mx-auto max-w-full flex flex-col-reverse gap-y-6">
                <div className="grid grid-cols-4 grid-flow-row auto-rows-min gap-y-12">
                    <ElixirBrand/>
                    <ElixirOrgs/>
                    <Links/>
                </div>
            </div>
        </footer>
    );
}

const ElixirBrand = () => {
    return (
        <div className="col-span-full lg:col-span-1 place-content-end">
            <div className="flex flex-col justify-between items-center lg:items-start gap-y-12">
                <a href="/" className="sm:order-1">
                    <img
                        alt="ELIXIR.NO Logo"
                        src="/assets/logos/elixir-no-light.svg"
                        className="hidden dark:block h-28 lg:h-36 w-auto"
                    />
                    <img
                        alt="ELIXIR.NO Logo"
                        src="/assets/logos/elixir-no-dark.svg"
                        className="block dark:hidden h-24 w-auto"
                    />
                </a>
                <div className="flex space-x-4 sm:order-2">
                    <SocialButton
                        name="LinkedIn"
                        link="https://www.linkedin.com/company/elixir-norway"
                        icon={<SiLinkedin className="h-8 w-8"/>}
                    />
                    <SocialButton
                        name="YouTube"
                        link="https://www.youtube.com/channel/UCvwFIw5HomylguGOGxR8B8w"
                        icon={<SiYoutube className="h-8 w-8"/>}
                    />
                    <SocialButton
                        name="Flickr"
                        link="https://www.flickr.com/photos/elixir-europe/"
                        icon={<SiFlickr className="h-8 w-8"/>}
                    />
                </div>
            </div>
        </div>
    );
};

const ElixirOrgs = () => {

    const orgs = [
        ["https://uib.no/", "/assets/logos/orgs/uib.svg", "UiB logo"],
        ["https://uio.no/", "/assets/logos/orgs/uio.svg", "UiO logo"],
        ["https://uit.no/", "/assets/logos/orgs/uit.svg", "UiT logo"],
        ["https://ntnu.no/", "/assets/logos/orgs/ntnu.svg", "NTNU logo"],
        ["https://nmbu.no/", "/assets/logos/orgs/nmbu.svg", "NMBU logo"],
    ];

    const funders = [
        ["https://forskningsradet.no/", "/assets/logos/orgs/nfr.svg", "Research Council of Norway logo"],
        ["https://www.nordforsk.org", "/assets/logos/orgs/nordforsk.svg", "Nordforsk logo"],
        ["https://research-and-innovation.ec.europa.eu/", "/assets/logos/orgs/eu.svg", "EU co-funded logo"],
    ];

    return (
        <div className="col-span-full lg:col-span-2 flex flex-col justify-between gap-y-6">
            <div className="flex flex-row flex-wrap items-center justify-center gap-x-8 lg:gap-x-4 mx-auto">
                {orgs.map(([href, imageUrl, alt]) => {
                    return (
                        <a href={href} target="_blank">
                            <img
                                src={imageUrl}
                                alt={alt}
                                className="invert-25 dark:invert-85 w-auto h-16 scale-75 lg:scale-100"
                            />
                        </a>
                    )
                })}
            </div>
            <div className="flex flex-row flex-wrap items-center justify-center gap-x-8 gap-y-4 lg:gap-x-4 mx-auto">
                {funders.map(([href, imageUrl, alt]) => {
                    return (
                        <a href={href} target="_blank">
                            <img
                                src={imageUrl}
                                alt={alt}
                                className="invert-25 dark:invert-85 w-44 h-auto scale-75 lg:scale-100"
                            />
                        </a>
                    )
                })}
            </div>
            <p className="text-sm text-pretty text-center lg:max-w-2xl m-auto flex-1">
                Financed by the Research Council of Norway’s grants 208481, 270068, 295932,
                the University of Bergen, the University of Oslo, the Arctic University
                of Norway in Tromsø, the Norwegian University of Science and Technology,
                the Norwegian University of Life Sciences: NMBU, Nordforsk and co-funded by the European Union.
            </p>
        </div>
    );
};

const Links = () => {
    return (
        <div
            className="col-span-full lg:col-span-1 text-right place-content-end place-items-end place-self-center lg:place-self-end">
            <div role="list" className="flex sm:flex-row lg:flex-col gap-y-2 gap-x-2 [&_*]:text-gray-800">
                <a href="research-support" className="text-sm leading-6">Support </a>
                <a href="https://elixir-europe.org/about-us/vacancies" className="text-sm leading-6">Careers</a>
                <a href="about" className="text-sm leading-6">Organisations</a>
            </div>
        </div>
    );
};


const SocialButton = ({ name, link, icon }) => {
    return (
        <a href={link} rel="noopener noreferrer" className="text-gray-500 hover:text-gray-400">
            <span className="sr-only">{name}</span>
            {icon}
        </a>
    );
};

export default Footer;
