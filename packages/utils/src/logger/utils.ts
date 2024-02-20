export const minifyEntity = ({
  type,
  name,
}: {
  type: string
  name: string
}): string => `${type}:${name}`
