# Development

## Prerequisites

Node 16. All packages come with `.nvmrc` file, so you can make use of it using some nvm scripts.

## Install

```
npm i
```

Will install everything in every package and link any dependencies (including in `./examples/`) using Lerna.

## Build

```sh
npm run build -- <package-name> [-w]
# examples:
npm run build -- client -w
npm run build -- server-testing
npm run build
```

- `<package-name>` name of npm package, not its directory (only of `@cardsgame/`)
- `-w` will start `build:watch` scripts instead

# Release

Bumping versions and publishing npm packages happens on CI. To initialize it, developer needs to rebase `main` branch onto `development`. Inspect [`.circleci/config.yml`](../.circleci/config.yml) for more details.

Bot user @greenly-builder is authenticated on CircleCI with read-**write** access, so it'll appear in release commits.

# Maintenance

> Old notes here, ignore for now

Keep generating changelog with these, until we hit 1.0

```
npx conventional-changelog --preset angular --release-count 0 --outfile ./CHANGELOG.md --verbose
npx lerna exec --concurrency 1 --stream -- 'conventional-changelog --preset angular --release-count 0 --commit-path $PWD --pkg $PWD/package.json --outfile $PWD/CHANGELOG.md --verbose'
```

# Server

# Units

All dimensional units are in **centimeters**, to be as close to reality as possible.

The client-side would have to decide how to scale it and present on any devices. Sometimes it would be needed to ignore some units, for example: table size on small mobile devices. Package `@cardsgame/utils` contains 2 useful methods for conversion: `cm2px()` and `px2cm()`
