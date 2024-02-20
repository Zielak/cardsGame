export const isBrowser = () => {
  return new Function("try {return this===window;}catch(e){ return false;}")()
}
