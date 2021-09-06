export const isBrowser = new Function(
  "try {return this===window;}catch(e){ return false;}"
)()

export const minifyEntity = ({
  type,
  name,
}: {
  type: string
  name: string
}): string => `${type}:${name}`
