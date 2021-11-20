/**
 * Trim long string with nice ell…
 */
export const trim = (string = "", maxLength = 7): string => {
  if (typeof string !== "string") {
    return
  } else {
    return string.length <= maxLength
      ? string
      : string.substr(0, maxLength - 1) + "…"
  }
}

/**
 * For now it's just 3 random letters
 */
export const randomName = (): string => {
  const randomLetter = (): string =>
    String.fromCharCode(Math.random() * (90 - 65) + 65)

  return randomLetter() + randomLetter() + randomLetter()
}

/**
 * Convert string to "camelCase"
 */
export const camelCase = (str = ""): string =>
  str
    .replace(/\s(.)/g, ($1) => $1.toUpperCase())
    .replace(/\s/g, "")
    .replace(/^(.)/, ($1) => $1.toLowerCase())

/**
 * Convert string to "SentenceCase" (first letter capital)
 */
export const sentenceCase = (str = ""): string =>
  str
    .replace(/\s(.)/g, ($1) => $1.toUpperCase())
    .replace(/^(.)/, ($1) => $1.toUpperCase())
