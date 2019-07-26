# Installing

Install external dependencies in all packages (root and all packages), and link the rest together with lerna.

```
npm run bootstrap
```

And then run some code watchers for continuous development:

```
npm run build:client-w
npm run build:server-w
```

# Units

All dimensional units are in milimeters, to be as close to reality as possible.

The clinent-side would have to decide how to scale it and present on any devices. Sometimes it would be needed to ignore some units, for example: table size on small mobile devices.
