const { execSync } = require("child_process")
const { readFileSync, mkdirSync, existsSync } = require("fs")
const { join } = require("path")

/**
 * Will generate new certs, or return previously generated certs
 * @returns {key, cert}
 */
module.exports = function () {
  const certsDir = join(__dirname)
  const configLocation = join(certsDir, "config")
  const keyLocation = join(certsDir, "localhost.key")
  const certLocation = join(certsDir, "localhost.crt")

  console.log("certsDir:       ", certsDir)
  console.log("configLocation: ", configLocation)
  console.log("keyLocation:    ", keyLocation)
  console.log("certLocation:   ", certLocation)

  if (!existsSync(keyLocation) || !existsSync(certLocation)) {
    console.log("one of the files doesn't exist, generating all")
    const command = [
      `openssl req -x509 -out ${certLocation} -keyout ${keyLocation}`,
      `-newkey rsa:2048 -nodes -sha256`,
      `-subj "/CN=localhost" -extensions EXT`,
      `-config ${configLocation}`,
    ]
    console.log("\n", command.join(" "), "\n")
    execSync(command.join(" "))
  } else {
    console.log("certs previously generated")
  }

  return {
    key: readFileSync(keyLocation),
    cert: readFileSync(certLocation),
  }
}
