const cardRank = [
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
  "A"
]

const sortRank = (rankA, rankB) => {
  if (cardRank.indexOf(rankA) < cardRank.indexOf(rankB)) {
    return -1
  } else if (cardRank.indexOf(rankB) < cardRank.indexOf(rankA)) {
    return 1
  }
  return 1
}

module.exports = {
  cardRank,
  sortRank
}
