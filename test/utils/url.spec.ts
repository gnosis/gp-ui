import { replaceURL } from 'utils/url'

describe('replace URL path according to network', () => {
  test('path is replaced to rinkeby', () => {
    const currentPath = '/xdai/address/0xb6bad41ae76a11d10f7b0e664c5007b908bc77c9'
    expect(replaceURL(currentPath, 'rinkeby')).toBe('/rinkeby/address/0xb6bad41ae76a11d10f7b0e664c5007b908bc77c9')
  })

  test('path is replaced to xdai', () => {
    const currentPath = '/rinkeby/address/0xb6bad41ae76a11d10f7b0e664c5007b908bc77c9'
    expect(replaceURL(currentPath, 'xdai')).toBe('/xdai/address/0xb6bad41ae76a11d10f7b0e664c5007b908bc77c9')
  })

  test('url is replaced to mainnet', () => {
    const currentPath = '/xdai/address/0xb6bad41ae76a11d10f7b0e664c5007b908bc77c9'
    expect(replaceURL(currentPath, 'mainnet')).toBe('/mainnet/address/0xb6bad41ae76a11d10f7b0e664c5007b908bc77c9')
  })
})
