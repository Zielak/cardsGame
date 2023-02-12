const randomPlayerNames = [
  "Alicja",
  "Bob",
  "Celine",
  "Darek",
  "Eddy",
  "Franek",
  "Gordon",
  "Hu",
  "Ione",
  "Jerry",
  "Karen",
  "Lukas",
  "Mat",
  "Natalie",
  "Ollie",
  "Pauline",
  "Rupert",
  "Sandra",
  "Tammy",
  "Ulyseus",
  "Vik",
  "Witeck",
  "Xavier",
  "Yumi",
  "Zoltan",
]

/**
 * @category Utility
 */
export function getRandomName(): string {
  randomPlayerNames.sort(() => {
    return Math.floor(Math.random() * 3) - 1
  })
  return randomPlayerNames.pop()
}
