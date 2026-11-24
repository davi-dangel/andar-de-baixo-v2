# AndarDeBaixo

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.11.

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build` to optimize gallery images and build the project. The build artifacts will be stored in the `dist/` directory.

### Static gallery images

`npm run images:optimize` reads gallery sources (including custom thumbnails) from
`src/assets/articles.db.json` and uses Sharp to generate 360, 720, and 1600 pixel
WebP variants at quality 78, without enlarging small images. EXIF orientation is
applied and metadata is stripped. Originals are not modified.

The generated manifest at `src/assets/gallery-images.json` supplies responsive
sources and dimensions. Image files go in `public/gallery/`, which Angular copies
into the static build. Their names hash the encoded content, so changing an image
produces a new URL. The grid selects a size for its rendered width; the fullscreen
viewer is only created on opening and loads its active image eagerly.

The first run downloads all remote gallery sources and may take several minutes.
Downloads are cached in `.cache/gallery/`; subsequent builds reuse generated
variants, including after an interrupted run. Changes to encoder settings
invalidate the variant cache. Both directories are gitignored. Commit manifest changes with article
changes, and run the optimizer again after editing gallery sources during
development. New images in the post designer use their supplied URLs until added
to the article database and optimized. Local sources must be paths under `public/`.
Missing remote images (HTTP 404/410) are reported as warnings and retain their
original URL; they still need fixing in the article database. Other download or
encoding failures stop the build with the offending source URL.
Transient network errors and HTTP 408/429/5xx responses are retried up to three
times with a two-minute timeout per attempt.

To refresh an original replaced at the same remote URL, clear `.cache/gallery/`
(or remove that source's cached download and `.json` variant metadata) and rerun
the optimizer. Prefer a new source URL when replacing a photo.

`npm start`, `npm run watch`, `npm run build`, and `npm run deploy` run optimization
automatically; invoking `ng` directly bypasses it. No image backend is required.

On a static host with configurable response headers, serve `gallery/*` with
`Cache-Control: public, max-age=31536000, immutable` and keep HTML revalidated.
GitHub Pages controls its own cache headers; this repository cannot override
them. Content-hashed filenames still prevent stale image reuse after deployment.

Run `npm run test:images` to test variant generation.

## Article pages

Each article in `src/assets/articles.db.json` has a `pages` array. Each page has a unique `number` and a `content` array of blocks. Pages and their blocks are displayed in array order. The post designer can add pages and edit their blocks.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## next steps
- [ ] config image gallery
- [ ] config image server
- [ ] add poems section
- [ ] add music/movies section
