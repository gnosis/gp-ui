export function buildSearchString(params: Record<string, string | undefined>): string {
  const filteredParams = Object.keys(params).reduce((acc, key) => {
    // Pick keys that have values non-falsy
    if (params[key]) {
      acc[key] = encodeURIComponent(params[key] as string)
    }
    return acc
  }, {})

  const searchObj = new URLSearchParams(filteredParams)

  return '?' + searchObj.toString()
}

export function replaceURL(url: string, strReplace: string): string {
  const re = /(([\w]+\/){0})([^/]+)(\/.+)*/gm
  const subst = '$1' + strReplace + '$4'
  console.log('Romiii', url.replace(re, subst))
  return url.replace(re, subst)
}
