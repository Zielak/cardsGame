import { createServer } from "http"
import { Server, logs } from "@cardsgame/server"

import { MakaoRoom } from "./makao"
import { ShuffleTest } from "./shuffleTest"
import { ContainersTest } from "./containersTest"

const WS_PORT = 2657

const gameServer = new Server({
  server: createServer()
})

gameServer.register("Makao", MakaoRoom)
gameServer.register("ShuffleTest", ShuffleTest)
gameServer.register("ContainersTest", ContainersTest)
logs.info("GAME", "registered all games")

gameServer.listen(parseInt("" + process.env.PORT) || WS_PORT)
