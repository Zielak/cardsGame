const { execSync } = require("child_process")
const { readFileSync, mkdirSync, existsSync } = require("fs")
const { join } = require("path")

module.exports = function () {
  const certsDir = join(__dirname, "./certs/")
  const configLocation = join(certsDir, "config")
  const keyLocation = join(certsDir, "localhost.key")
  const certLocation = join(certsDir, "localhost.crt")

  if (!existsSync(certsDir)) {
    mkdirSync(certsDir)
  }

  if (!existsSync(keyLocation) || !existsSync(certLocation)) {
    const command = [
      `openssl req -x509 -out ${certLocation} -keyout ${keyLocation}`,
      "-newkey rsa:2048 -nodes -sha256",
      "-subj '/CN=localhost' -extensions EXT",
      `-config ${configLocation}`,
    ]
    execSync(command.join(" "))
  }

  return {
    key: readFileSync(keyLocation),
    cert: readFileSync(certLocation),
  }
}
