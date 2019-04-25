export const map2Array = <T>(map: { [key: string]: T | any }): T[] =>
  Object.keys(map)
    .sort()
    .map(key => map[key])

export const mapGetIdx = (map: {}, entry: any): number => {
  const max = Object.keys(map).length
  for (let i = 0; i < max; i++) {
    if (map[i] === entry) return i
  }
  return -1
}

export const mapAdd = (map: {}, entry: any): number => {
  const newIdx = Object.keys(map).length
  map[newIdx] = entry
  return newIdx
}

export const mapCount = (map: {}): number => {
  return Object.keys(map).length
}

export const mapRemoveIdx = (map: {}, idx: number): boolean => {
  if (typeof map[idx] === "undefined") return false
  const max = Object.keys(map).length - 1
  for (let i = idx + 1; i <= max; i++) {
    map[i - 1] = map[i]
  }
  delete map[max]

  return true
}

export const mapRemoveEntry = (map: {}, entry: any): boolean => {
  const idx = mapGetIdx(map, entry)
  if (idx === -1) return false
  return mapRemoveIdx(map, idx)
}
