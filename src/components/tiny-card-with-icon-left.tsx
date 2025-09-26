export default function TinyCardWithIconLeft({ icon: Icon, title, children }) {
    return (
        <div
            className="relative pl-24 h-full w-full animate__animated animate__fadeIn">
            <dt className="text-lg font-semibold">
                <div className="absolute left-0 top-0 flex h-16 w-16 items-center justify-center rounded-lg">
                    <Icon className="text-brand-primary dark:text-brand-secondary w-full h-14"/>
                </div>
                <span>{title}</span>
            </dt>
            <dd className="mt-1 text-base leading-7">
                {children}
            </dd>
        </div>
    )
}
