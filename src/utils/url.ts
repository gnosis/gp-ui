import { Network } from 'types'

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

export function replaceURL(url: string, strReplace: string, currentNetwork: number): string {
  const re = strReplace ? /(([\w]+\/){0})([^/]+)(\/.+)*/gm : /(?:\/[^/]+){1}/
  const subst = strReplace ? '$1' + strReplace + '$4' : ''
  if (currentNetwork === Network.Mainnet) return url.replace(/^/, `/${strReplace}`)
  else return url.replace(re, subst)
}
