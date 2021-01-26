import { domain as domainGp, signOrder as signOrderGp, Order } from '@gnosis.pm/gp-v2-contracts'

import { GP_SETTLEMENT_CONTRACT_ADDRESS } from './constants'
import { TypedDataDomain, Signer } from 'ethers'
import { Network } from 'types'

export { OrderKind } from '@gnosis.pm/gp-v2-contracts'
export type UnsignedOrder = Order

export interface SignOrderParams {
  networkId: Network
  signer: Signer
  order: UnsignedOrder
}

// posted to /api/v1/orders on Order creation
// serializable, so no BigNumbers
//  See https://protocol-rinkeby.dev.gnosisdev.com/api/
export interface OrderCreation extends UnsignedOrder {
  // TODO: I commented this because I expect the API and contract to follow the same structure for the order data. confirm and delete this comment
  signature: string // 65 bytes encoded as hex without `0x` prefix. v + r + s from the spec
}

// TODO: We cannot make use of the NPM exported enum, see https://babeljs.io/docs/en/babel-plugin-transform-typescript#caveats
//      use workaround?
// /**
//  * The signing scheme used to sign the order.
//  */
// export declare const enum SigningScheme {
//   /**
//    * The EIP-712 typed data signing scheme. This is the preferred scheme as it
//    * provides more infomation to wallets performing the signature on the data
//    * being signed.
//    *
//    * <https://github.com/ethereum/EIPs/blob/master/EIPS/eip-712.md#definition-of-domainseparator>
//    */
//   TYPED_DATA = 0,
//   /**
//    * The generic message signing scheme.
//    */
//   MESSAGE = 1
// }

// TODO: For now, instead of using enums (see todo above)
const TYPED_DATA_SIGNING_SCHEME = 0

function _getDomain(networkId: Network): TypedDataDomain {
  // Get settlement contract address
  const settlementContract = GP_SETTLEMENT_CONTRACT_ADDRESS[networkId]

  if (!settlementContract) {
    throw new Error('Unsupported network. Settlement contract is not deployed')
  }

  return domainGp(networkId, settlementContract) // TODO: Fix types in NPM package
}

export async function signOrder(params: SignOrderParams): Promise<string> {
  const { networkId, signer, order } = params

  const domain = _getDomain(networkId)
  console.log('[api:operator:signature] signOrder', { domain, order, signer, TYPED_DATA_SIGNING_SCHEME })
  return signOrderGp(domain, order, signer, TYPED_DATA_SIGNING_SCHEME)
}
