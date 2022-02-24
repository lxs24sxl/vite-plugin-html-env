export const _omit = (obj = {}, uselessKeys = []) => {
  return Object.keys(obj || {}).reduce((cur, key) => {
    return uselessKeys.includes(key) ? cur: {...cur, [key]: obj[key]}
  },  {})
}

export const _pick = (obj, useKeys = []) => {
  return Object.keys(obj).length ? useKeys.reduce((cur, key) => {
    return {
      ...cur,
      [key]: obj[key]
    }
  }, {}): null
}
