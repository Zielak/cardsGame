# Development

## Prerequisites

Node 20. All packages come with `.nvmrc` file, so you can make use of it using some nvm scripts.

## Install

```
npm i
```

This project is using npm workspaces. `npm i` will install everything in every package and link any dependencies (including in `./examples/`).

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

....

# Server

## Units

All dimensional units are in **centimeters**, to be as close to reality as possible.

The client-side would have to decide how to scale it and present on any devices. Sometimes it would be needed to ignore some units, for example: table size on small mobile devices. Package `@cardsgame/utils` contains 2 useful methods for conversion: `cm2px()` and `px2cm()`
