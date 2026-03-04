# Elixir.no Website

Welcome to the project! This README will help you get started and understand how the project is structured. Let’s dive right in!

## Prerequisites

Before you can work on this project, you need to have **Node.js** installed on your machine. You can download it from [here](https://nodejs.org/).

To check if you already have Node.js installed, run the following command in your terminal:

```bash
node -v
```

This should return the version number of Node.js installed. If you see something like v16.x.x or higher, you're good to go!

## Cloning the Repository

To get started, you need to clone the repository. Run this command in your terminal:

```bash
git clone https://github.com/ELIXIR-NO/website.git
```

Once cloned, navigate into the project directory:

```bash
cd website
```

## Installing Dependencies

After cloning the repository, you’ll need to install the necessary dependencies. We use `pnpm` as our package manager. Install the dependencies using:

```bash
pnpm install
```

If you don’t have pnpm installed globally, you can install it by running:

```bash
npm install -g pnpm
```

## Project Structure

This project follows a specific directory structure to organize the content. As a contributor, you will primarily be working inside the src/content/ folder. Below is a breakdown of the key directories within src/content/:

- `about`: Contains all the pages related to Elixir Node information. You will find details about the node services, missions, and visions here.
- `banner`: Holds the content for the top overlay banner that appears across the website. If you need to update the banner, this is where you do it.
- `landing`: The main landing page content resides here. Any changes or updates to the homepage should be made in this folder.
- `news`: This is where all the news articles are stored. If you're adding new articles or updating existing ones, you will be working here.
- `projects`: Deprecated folder for old project-related content. This will be removed in future updates, so avoid making changes here.
- `research`-support: This folder holds the content for the Research Support page. You will find research-related resources and support documents here.
- `services`: Contains content for all the service-related pages. If you need to edit or add new services to the website, work here.
- `training`: This is where you manage the content for the Training page, including courses, workshops, and any related training materials.

## Running the Project Locally

To run the project locally, use the following command:

```bash
pnpm start
```

This will start a local server, and you can view the project by going to http://localhost:4321 in your web browser. Any changes you make in the src/content/ folder will be reflected here in real-time.

## Contributing

> For minor changes and edits, please refer to the wiki guide available at [https://github.com/ELIXIR-NO/website/wiki](https://github.com/ELIXIR-NO/website/wiki).

Clone the repository as shown above.

Create a new branch for your changes:

```bash
git checkout -b feature/new-feature-name
```

After making your changes, commit them:

```bash
git commit -m "Add a clear and concise commit message"
```

Push your changes and create a pull request:

```bash
git push origin feature/new-feature-name
```

That’s it! You're now ready to contribute to the project.

## Deployment

The site is built as a **static site** and deployed to **GitHub Pages**, served publicly via a reverse proxy at `https://elixir.no`.

```
Browser → elixir.no (UiO reverse proxy, Harika cert)
              ↓
    elixir-no.github.io/website/  (GitHub Pages, static)
```

GitHub Pages is triggered automatically on every push to `main` via `.github/workflows/gh-pages.yml`.

---

### Migrating away from Cloudflare

The site previously used `@astrojs/cloudflare` for SSR deployment to `website-70w.pages.dev`, proxied via `elixir.no`. To fully remove Cloudflare and switch to GitHub Pages + reverse proxy, the following changes are required.

#### Code changes

**`astro.config.mjs`**

Remove all Cloudflare and `GITHUB_PAGES` conditional logic. The config becomes unconditionally static:

```js
// Remove these lines:
import cloudflare from '@astrojs/cloudflare';
const isGithubPages = process.env.GITHUB_PAGES === 'true';
// the consolidateRoutes() integration (Cloudflare-specific)
// output: isGithubPages ? "static" : "server",
// ...(isGithubPages ? {} : { adapter: cloudflare() }),
// base: isGithubPages ? '/website' : undefined,
// site: isGithubPages ? 'https://elixir-no.github.io' : 'https://elixir.no',
// [rehypeRelativeAssets, { base: isGithubPages ? '/website' : '' }],

// Replace with:
site: 'https://elixir.no',
// no base, no adapter, no output (static is the default)
// rehypeRelativeAssets with no options
```

**`package.json`**

Remove the Cloudflare adapter dependency:

```bash
pnpm remove @astrojs/cloudflare
```

**`.github/workflows/gh-pages.yml`**

Remove the `GITHUB_PAGES: true` env var from the build step — it is no longer needed.

#### DevOps changes

Update the reverse proxy target from `website-70w.pages.dev` to `elixir-no.github.io/website/`:

```nginx
location / {
    proxy_pass        https://elixir-no.github.io/website/;
    proxy_set_header  Host elixir-no.github.io;  # required — GH Pages routes by Host header
    proxy_ssl_server_name on;                     # SNI for GitHub's TLS

    # Rewrite Location headers from GH Pages 301/302 redirects
    # (e.g. trailing-slash normalisation) so users stay on elixir.no
    proxy_redirect    https://elixir-no.github.io/website/ https://elixir.no/;
}
```

Key points:
- `Host: elixir-no.github.io` is critical — without it GitHub Pages returns 404 for every request
- `proxy_ssl_server_name on` is required for SNI when proxying to an HTTPS upstream
- `proxy_redirect` prevents users being bounced to the raw `elixir-no.github.io` URL when GitHub Pages issues a redirect

---

### Base URL rule for content authors

**Never hardcode absolute paths** like `/assets/...` or `/data/...` in content files or components. These break whenever the site is served from a subpath (e.g. during GitHub Pages preview without a proxy).

**In MDX files** — use relative paths for images and links:

```mdx
![My image](./photo.png)
[Download](./report.pdf)
```

These are rewritten automatically by the `rehypeRelativeAssets` plugin.

For paths in **JSX component props** inside MDX (e.g. `src=`, `figSrc=`), relative paths are not rewritten. Export a `BASE` constant at the top of the file instead:

```mdx
export const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

<MyComponent src={`${BASE}/assets/figures/my-image.svg`} />
```

**In `.astro` and `.tsx` components** — use the same pattern:

```ts
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
// then: `${BASE}/assets/...`, `${BASE}/data/...`, etc.
```

In production (no base configured), `BASE` is an empty string and paths resolve to `/assets/...` as expected. The pattern is forward-compatible: if a base is ever set, all paths adjust automatically.

## Questions?

If you have any questions, feel free to reach out through the project's communication channels.

