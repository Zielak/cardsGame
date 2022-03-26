export const cardRank = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
]

export const sortRank = (rankA: string, rankB: string): number => {
  if (cardRank.indexOf(rankA) < cardRank.indexOf(rankB)) {
    return -1
  } else if (cardRank.indexOf(rankB) < cardRank.indexOf(rankA)) {
    return 1
  }
  return 0
}
