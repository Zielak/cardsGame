import { createServer } from "https"
import { readFileSync } from "fs"
import files from "serve-static"
import cache from "http-cache-middleware"
import path from "path"
import restana from "restana"

import { Server, logs } from "@cardsgame/server"
import { genCertificate } from "./genCertificatese"

import { MakaoRoom } from "./makao"
import { ShuffleTest } from "./shuffleTest"
import { SplendorRoom } from "./splendor"
import { ContainersTest } from "./containersTest"

const PORT = 443

genCertificate().then(tlsOptions => {
  const app = restana({
    disableResponseEvent: true,
    server: createServer(tlsOptions)
  })
  app.use(cache())

  const serve = files(path.join(__dirname, "../client"), {
    lastModified: false,
    setHeaders: (res, path) => {
      res.setHeader("cache-control", "public, no-cache, max-age=604800")
    }
  })

  app.use((req, res, done) => {
    // const done = finish(req, res)
    serve(req, res, done)
  })

  const gameServer = new Server({
    server: app.getServer()
  })

  gameServer.register("Makao", MakaoRoom)
  gameServer.register("Splendor", SplendorRoom)
  gameServer.register("ShuffleTest", ShuffleTest)
  gameServer.register("ContainersTest", ContainersTest)
  logs.info("GAME", "registered all games")

  app.start(PORT)
  // gameServer.listen(WS_PORT)
})
