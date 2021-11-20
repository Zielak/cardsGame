# Development

Install external dependencies in all packages (root project and all sub packages), and link the rest together with lerna:

```
npm install
npm run bootstrap
```

And then run some code watchers for continuous development (each in different terminal):

```
npm run build:utils-w
npm run build:client-w
npm run build:server-w
```

# Release

You'll need to set up a local `.env` file in the repo root to provide the required environment variables.
The `.env.example` file is available in the root as a template.

```sh
npm run release
```

# Maintenance

> Old notes here, ignore for now

Keep generating changelog with these, until we hit 1.0

```
npx conventional-changelog --preset angular --release-count 0 --outfile ./CHANGELOG.md --verbose
npx lerna exec --concurrency 1 --stream -- 'conventional-changelog --preset angular --release-count 0 --commit-path $PWD --pkg $PWD/package.json --outfile $PWD/CHANGELOG.md --verbose'
```

# Server

## Traits updates and QueryRunner

All props in `QuerableProps` are generated from existing entities. Keep them and the "ignored props" updated with any changes to any new or existing traits.

# Units

All dimensional units are in **centimeters**, to be as close to reality as possible.

The client-side would have to decide how to scale it and present on any devices. Sometimes it would be needed to ignore some units, for example: table size on small mobile devices. Package `@cardsgame/utils` contains 2 useful methods for conversion: `cm2px()` and `px2cm()`
