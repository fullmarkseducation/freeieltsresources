# Free IELTS Resources

A static starter website for free IELTS preparation links, official sample PDFs, and free essay review or speaking session requests.

Run `npm run dev` and open `http://localhost:8000` to view the site.

## Requests

The request form uses a `mailto:` link for now, so messages are sent through the visitor's email app instead of being stored on the site. Requests are sent to `freeieltsresources@outlook.com`.

Users should request only one free writing review or one free speaking session per person.

## Blog CMS

Blog posts live in `content/blog` as Markdown files and are configured for TinaCMS. Use Node 22 LTS for the Tina tooling on this machine:

```sh
export PATH="/opt/homebrew/opt/node@22/bin:$PATH"
npm run build:cms
npm run dev
```

Then open `http://localhost:8000/admin/index.html`.

After editing posts, run `npm run content` to refresh `public/blog-data.json` for the static site.

Note: Tina's local indexing command currently exits with `LEVEL_CONNECTION_LOST` in this plain static setup, so `build:cms` uses Tina's `--skip-indexing` mode to generate the admin bundle. The Markdown blog and static rendering are working; live local editing may need a Tina CLI fix or a move to a supported SSG such as Astro/Next for full Tina local mode.

## PDF policy

The site links to official/public sample PDFs and keeps `public/pdfs/` ready for authorized files. Do not host copied commercial IELTS book PDFs unless redistribution is explicitly allowed.
