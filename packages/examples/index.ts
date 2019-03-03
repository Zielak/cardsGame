import * as Cards from "./index"
import { createServer } from "http"

import { MakaoRoom } from "./games/makao"
import { ContainersTest } from "./games/containersTest"

const WS_PORT = 2657

const gameServer = new Cards.Server({
  server: createServer()
})

gameServer.register("Makao", MakaoRoom)
gameServer.register("ContainersTest", ContainersTest)
Cards.logs.info("GAME", "registered all games")

gameServer.listen(parseInt("" + process.env.PORT) || WS_PORT)
