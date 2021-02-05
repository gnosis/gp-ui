import { TokenErc20 } from '@gnosis.pm/dex-js'

import { Network } from 'types'

import { SaveMultipleErc20ActionType } from './types'

export const saveMultipleErc20 = (erc20s: TokenErc20[], networkId: Network): SaveMultipleErc20ActionType => ({
  type: 'SAVE_MULTIPLE_ERC20',
  payload: { erc20s, networkId },
})

// Syntactic sugar
export const saveSingleErc20 = (erc20: TokenErc20, networkId: Network): SaveMultipleErc20ActionType =>
  saveMultipleErc20([erc20], networkId)
