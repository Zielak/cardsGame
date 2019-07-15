import greenlock from "greenlock"
import store from "greenlock-store-fs"
import { logs } from "@cardsgame/server"
import { exec, execSync } from "child_process"
import { readFileSync } from "fs"
import { join } from "path"

export async function genCertificate() {
  // Self-signed ceerts for now

  const configLocation = join(__dirname, "../../certs/config")
  const keyLocation = join(__dirname, "../../certs/localhost.key")
  const certLocation = join(__dirname, "../../certs/localhost.crt")

  const command = [
    `openssl req -x509 -out ${certLocation} -keyout ${keyLocation}`,
    "-newkey rsa:2048 -nodes -sha256",
    "-subj '/CN=localhost' -extensions EXT",
    `-config ${configLocation}`
  ]
  execSync(command.join(" "))
  return {
    key: readFileSync(keyLocation),
    cert: readFileSync(certLocation)
  }
  // if (process.env.NODE_ENV === "production") {
  //   const certOptions = {
  //     domains: ["cards.darekgreenly.com"],
  //     email: "cards@zielak.pl",
  //     agreeTos: true
  //   }

  //   const lock = greenlock.create({
  //     version: "draft-12",
  //     server: "https://acme-v02.api.letsencrypt.org/directory",
  //     configDir: "~/acme/etc",
  //     store
  //   })

  //   return await lock.register(certOptions).then(
  //     certs => {
  //       logs.info(certs)
  //       // privkey, cert, chain, expiresAt, issuedAt, subject, altnames
  //     },
  //     err => {
  //       logs.error(err)
  //     }
  //   )
  // } else {
  // }
}
