# parlacards

## ⚠️ WARNING ️️⚠️
We have replaced the card development process used in this repository with a different one based on Vue.js (see [parlanode](//github.com/muki/parlanode) repository for details). While it still contains a lot of production code, we strongly discourage using it to develop new cards.

## Introduction

This repository contains front-end implementations of parlameter cards. Before they start their life on [parlameter.si](//parlameter.si), they are first developed here, then compiled and then manually (or automatically) inserted into the parlanode database using the CMS. From there, card templates are available to be used for serving requests with `parlanode`.

## File/folder organization
Cards are stored in (sub)directories that correspond to their group/method; e.g. if the request is `https://glej.parlameter.si/s/seznam-sej/`, all card files will be stored in the subfolder `s/seznam-sej`. But keep in mind that this is just a matter of convention, real group/method names are actually specified when adding a card to the CMS. They can be (and seldom are) different from the folder names in this repo.

Every card folder contains the following files:

- **card.json** - card metadata such as name, data source URL, CMS id and time of last update
- **data.json** - sample response of the card's data URL, used as data source instead of real API during development
- **state.json** _(optional)_ - sample state object, used for simulation purposes during development (in production, state object is passed as a URL parameter)
- **card.ejs** - card template written in [ejs](http://ejs.co/)
- **scss/style.scss** - card styling written in [Sass](http://sass-lang.com/) (scss syntax)
- **js/script.js** - card logic written in JavaScript

## Initial setup
```bash
yarn
yarn global add gulp
```

## Running gulp tasks
You may run commands from the root directory with `gulp <command> --path=<path-to-card>`. The following are available:
- `build` - compiles specified card into root's `dist/card.min.ejs`
- `serve` - starts live server serving specified card
- `push-build` - compiles specified card and pushes it to CMS (only for existing cards, initial publish must be manual)

If you are working on a single card for a while, you may edit `gulpfile.js` and set `defaultPath` to that card (e.g. `'p/seznam-poslancev'`) to avoid specifying `--path=<path-to-card>` every time.

## Creating a new card
There is a blank template for a new card in `/card`. You can copy it manually or use:
```bash
mkdir -p path/to/new/card && cp -R card/* "$_"
```

## Updating all cards
If you made a card-wide change and don't want to manually push-build them one by one, run:
```bash
./update-all.sh
```
