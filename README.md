# parlacards

## Initial setup
```bash
npm install
npm install gulp -g
```

## Running gulp tasks
You may run commands from the root directory with `gulp <command> --path=<path-to-card>`. The following are available:
- `build` - compiles specified card into root's `dist/card.min.ejs`
- `serve` - starts live server serving specified card
- `push-build` - compiles specified card and pushes it to CMS

If you are working on a single card for a while, you may edit `gulpfile.js` and set `defaultPath` to that card (e.g. `'p/seznam-poslancev'`) to avoid specifying `--path=<path-to-card>` every time.

## Creating a new card
```bash
mkdir -p path/to/new/card && cp -R card/* "$_"
```

## Updating all cards
If you made a card-wide change and don't want to manually push-build them one by one, run:
```bash
./update-all.sh
```
