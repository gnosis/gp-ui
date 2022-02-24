import { TENDERLY_API_URL } from 'const'
import { Network } from 'types'
import { fetchQuery } from 'api/baseApi'

function _urlAvailableNetwork(): Partial<Record<Network, string>> {
  const urlNetwork = (_networkId: Network): string => `${TENDERLY_API_URL}/${_networkId}`

  return {
    [Network.Mainnet]: urlNetwork(Network.Mainnet),
    [Network.Rinkeby]: urlNetwork(Network.Rinkeby),
    [Network.xDAI]: urlNetwork(Network.xDAI),
  }
}

const API_BASE_URLs = _urlAvailableNetwork()

function _getApiBaseUrl(networkId: Network): string {
  const baseUrl = API_BASE_URLs[networkId]

  if (!baseUrl) {
    throw new Error('Unsupported Network. The tenderly API is not available in the Network ' + networkId)
  } else {
    return baseUrl
  }
}

function _get(networkId: Network, url: string): Promise<Response> {
  const baseUrl = _getApiBaseUrl(networkId)
  return fetch(baseUrl + url)
}

export interface Trade {
  owner: string
  sellToken: string
  buyToken: string
  sellAmount: string
  buyAmount: string
  feeAmount: string
  orderUid: string
}

interface Trace {
  logs: [Log]
  transaction_id: string
}

interface Log {
  name: string
  raw: Raw
  inputs: Array<Input>
}

interface Raw {
  address: string
}

interface Input {
  value: string
}

export interface Transfer {
  from: string
  to: string
  value: string
  token: string
}

interface TradesAndTransfersResult {
  transfers: Transfer[]
  trades: Trade[]
}

const ETH_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

export async function fetchTradesAndTransfers(networkId: Network, hash: string): Promise<TradesAndTransfersResult> {
  const queryString = `/trace/${hash}`
  const response = await fetchQuery<Trace>({ get: () => _get(networkId, queryString) }, queryString)
  const transfers: Array<Transfer> = []
  const trades: Array<Trade> = []

  response.logs.forEach((log) => {
    if (log.name === 'Transfer') {
      transfers.push({
        token: log.raw.address,
        from: log.inputs[0].value,
        to: log.inputs[1].value,
        value: log.inputs[2].value,
      })
    } else if (log.name === 'Trade') {
      const trade = {
        owner: log.inputs[0].value,
        sellToken: log.inputs[1].value,
        buyToken: log.inputs[2].value,
        sellAmount: log.inputs[3].value,
        buyAmount: log.inputs[4].value,
        feeAmount: log.inputs[5].value,
        orderUid: log.inputs[6].value,
      }
      if (trade.buyToken === ETH_ADDRESS) {
        //ETH transfers are not captured by ERC20 events, so we need to manyally add them to the Transfer list
        transfers.push({
          token: ETH_ADDRESS,
          from: log.raw.address,
          to: trade.owner,
          value: trade.buyAmount,
        })
      }
      trades.push(trade)
    }
  })

  return { transfers, trades }
}
