import { TENDERLY_API_URL, ETH_NULL_ADDRESS } from 'const'
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
  name: TypeOfTrace
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

export interface Account {
  alias: string
}

interface Contract {
  address: string
  contract_name: string
}

export async function fetchTrace(networkId: Network, txHash: string): Promise<Trace> {
  const queryString = `/trace/${txHash}`
  return fetchQuery<Trace>({ get: () => _get(networkId, queryString) }, queryString)
}

export async function fetchTradesAccounts(
  networkId: Network,
  hash: string,
  trades: Array<Trade>,
  transfers: Array<Transfer>,
): Promise<Map<string, Account>> {
  const queryString = `/tx/${hash}/contracts`

  const contracts = await fetchQuery<Array<Contract>>({ get: () => _get(networkId, queryString) }, queryString)
  const result = new Map()

  contracts
    .filter((contract: Contract) => {
      // Only usecontracts which are involved in a transfer
      return transfers.find((transfer) => {
        return transfer.from === contract.address || transfer.to === contract.address
      })
    })
    .forEach((contract: Contract) => {
      result.set(contract.address, {
        alias: contract.contract_name,
      })
    })
  trades.forEach((trade) => {
    result.set(trade.owner, {
      alias: 'Trader',
    })
  })
  // Track any missing from/to contract as unknown
  transfers
    .flatMap((transfer) => {
      return [transfer.from, transfer.to]
    })
    .forEach((address) => {
      if (!result.get(address)) {
        result.set(address, {
          alias: address,
        })
      }
    })
  return result
}

enum TypeOfTrace {
  TRANSFER = 'Transfer',
  TRADE = 'Trade',
}

export async function getTradesAndTransfers(
  networkId: Network,
  txHash: string,
): Promise<{ transfers: Transfer[]; trades: Trade[] }> {
  const trace = await fetchTrace(networkId, txHash)
  const transfers: Array<Transfer> = []
  const trades: Array<Trade> = []

  trace.logs.forEach((log) => {
    if (log.name === TypeOfTrace.TRANSFER) {
      transfers.push({
        token: log.raw.address,
        from: log.inputs[0].value,
        to: log.inputs[1].value,
        value: log.inputs[2].value,
      })
    } else if (log.name === TypeOfTrace.TRADE) {
      const trade = {
        owner: log.inputs[0].value,
        sellToken: log.inputs[1].value,
        buyToken: log.inputs[2].value,
        sellAmount: log.inputs[3].value,
        buyAmount: log.inputs[4].value,
        feeAmount: log.inputs[5].value,
        orderUid: log.inputs[6].value,
      }
      if (trade.buyToken === ETH_NULL_ADDRESS) {
        //ETH transfers are not captured by ERC20 events, so we need to manyally add them to the Transfer list
        transfers.push({
          token: ETH_NULL_ADDRESS,
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
