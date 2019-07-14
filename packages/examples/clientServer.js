const { createServer } = require("https")
const { readFileSync } = require("fs")
const files = require("serve-static")
const cache = require("http-cache-middleware")
const path = require("path")

const service = require("restana")({
  disableResponseEvent: true,
  server: createServer({
    key: readFileSync(path.join(__dirname, "certs/cert.key")),
    cert: readFileSync(path.join(__dirname, "certs/cert.pem"))
  })
})
service.use(cache())

const serve = files(path.join(__dirname, "dist/client"), {
  lastModified: false,
  setHeaders: (res, path) => {
    res.setHeader("cache-control", "public, no-cache, max-age=604800")
  }
})

service.use((req, res, done) => {
  // const done = finish(req, res)
  serve(req, res, done)
})

service.start(443)
