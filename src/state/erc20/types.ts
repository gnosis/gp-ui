import { TokenErc20 } from '@gnosis.pm/dex-js'

import { Network } from 'types'

import { Actions } from 'state'

export type ActionTypes = 'SAVE_MULTIPLE_ERC20'

export type Erc20State = Map<string, TokenErc20>

export type SaveMultipleErc20ActionType = Actions<ActionTypes, { erc20s: TokenErc20[]; networkId: Network }>
export type ReducerActionType = SaveMultipleErc20ActionType
