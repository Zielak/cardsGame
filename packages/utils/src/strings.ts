/**
 * Trim long string with nice ell…
 * Works only on string, don't put numbers in it.
 * @category String
 */
export const trim = (string = "", maxLength = 7): string => {
  if (typeof string !== "string") {
    return ""
  } else {
    return string.length <= maxLength
      ? string
      : string.substring(0, maxLength - 1) + "…"
  }
}

/**
 * For now it's just 3 random letters
 * @category String
 */
export const randomName = (): string => {
  const randomLetter = (): string =>
    String.fromCharCode(Math.random() * (90 - 65) + 65)

  return randomLetter() + randomLetter() + randomLetter()
}

/**
 * Convert string to "camelCase"
 * @category String
 */
export const camelCase = (str = ""): string =>
  str
    .replace(/\s(.)/g, ($1) => $1.toUpperCase())
    .replace(/\s/g, "")
    .replace(/^(.)/, ($1) => $1.toLowerCase())

/**
 * Convert string to "SentenceCase" (first letter capital)
 * @category String
 */
export const sentenceCase = (str = ""): string =>
  str
    .replace(/\s(.)/g, ($1) => $1.toUpperCase())
    .replace(/^(.)/, ($1) => $1.toUpperCase())
