export const trim = (string = "", maxLength = 7) => {
  if (typeof string !== "string") return
  return string.length <= maxLength
    ? string
    : string.substr(0, maxLength - 1) + "…"
}

export const randomName = () => {
  const randomLetter = () => String.fromCharCode(Math.random() * (90 - 65) + 65)
  return randomLetter() + randomLetter() + randomLetter()
}

export const camelCase = (str = "") =>
  str
    .replace(/\s(.)/g, $1 => $1.toUpperCase())
    .replace(/\s/g, "")
    .replace(/^(.)/, $1 => $1.toLowerCase())

export const sentenceCase = (str = "") =>
  str
    .replace(/\s(.)/g, $1 => $1.toUpperCase())
    .replace(/^(.)/, $1 => $1.toUpperCase())
