# Free IELTS Resources

A static starter website for free IELTS preparation links, official sample PDFs, and free essay review or speaking session requests.

Run `npm run dev` and open `http://localhost:8000` to view the site.

The live site is deployed from `public/` through the GitHub Pages workflow in `.github/workflows/pages.yml`. Root-level static files are also present so GitHub Pages still serves the website if the repository is temporarily configured to deploy from `main / root`.

## Requests

The request form uses a `mailto:` link for now, so messages are sent through the visitor's email app instead of being stored on the site. Requests are sent to `freeieltsresources@outlook.com`.

Users should request only one free writing review or one free speaking session per person.

## Blog CMS

Blog posts live in `content/blog` as Markdown files and are configured for TinaCMS.

Copy `.env.example` to `.env` and fill in the TinaCloud values from your Tina project:

- `NEXT_PUBLIC_TINA_CLIENT_ID`: from the TinaCloud project overview
- `TINA_TOKEN`: the read-only token from the TinaCloud tokens page
- `NEXT_PUBLIC_TINA_BRANCH`: `main`

Use Node 22 LTS for the Tina tooling on this machine:

```sh
export PATH="/opt/homebrew/opt/node@22/bin:$PATH"
npm run build:cms
npm run dev
```

Then open `http://localhost:8000/admin/index.html`.

After editing posts, run `npm run content` to refresh `public/blog-data.json` for the static site.

For GitHub Pages, add these repository secrets before deploying Tina admin:

- `NEXT_PUBLIC_TINA_CLIENT_ID`
- `TINA_TOKEN`

The Pages workflow builds the static blog data, generates Tina's `public/admin` editor, and deploys `public/`.

## PDF policy

The site links to official/public sample PDFs and keeps `public/pdfs/` ready for authorized files. Do not host copied commercial IELTS book PDFs unless redistribution is explicitly allowed.
