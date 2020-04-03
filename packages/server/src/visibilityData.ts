// Deprecated
export class VisibilityData {
  private data: {
    [key: string]: VisibilityEntry
  } = {}

  add(
    keys: string[] | string,
    toEveryone: () => boolean,
    toOwner: () => boolean
  ) {
    if (!Array.isArray(keys)) {
      keys = [keys]
    }
    keys.forEach((key) => {
      this.data[key] = {
        toEveryone,
        toOwner,
      }
    })
  }

  shouldSendToEveryone(key: string) {
    if (!this.data[key] || !this.data[key].toEveryone) {
      return
    }
    return this.data[key].toEveryone()
  }

  shouldSendToOwner(key: string) {
    if (!this.data[key] || !this.data[key].toOwner) {
      return
    }
    return this.data[key].toOwner()
  }

  get keys() {
    return Object.keys(this.data)
  }
}

type VisibilityEntry = {
  toEveryone: () => boolean
  toOwner: () => boolean
}
