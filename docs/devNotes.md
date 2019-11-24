# Development

Install external dependencies in all packages (root project and all sub packages), and link the rest together with lerna.

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

# Server

## Traits updates and QueryRunner

All props in `QuerableProps` are written by hand. Keep them updated with any changes to any new or existing traits.

# Units

All dimensional units are in **centimeters**, to be as close to reality as possible.

The clinent-side would have to decide how to scale it and present on any devices. Sometimes it would be needed to ignore some units, for example: table size on small mobile devices. Package `@cardsgame/utils` contains 2 useful methods for conversion: `cm2px()` and `px2cm()`
