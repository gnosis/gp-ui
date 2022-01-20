import React from 'react'
import { useParams } from 'react-router'

import { isATxHash } from 'utils'
import RedirectToSearch from 'components/RedirectToSearch'
import { BlockExplorerLink } from 'components/common/BlockExplorerLink'
import { TitleAddress, Wrapper } from 'apps/explorer/pages/styled'
import { useNetworkId } from 'state/network'
import { TransactionsTableWidget } from 'apps/explorer/components/TransactionsTableWidget'

const TransactionDetails: React.FC = () => {
  const { txHash } = useParams<{ txHash: string }>()
  const networkId = useNetworkId() || undefined

  if (!isATxHash(txHash)) {
    return <RedirectToSearch from="tx" />
  }

  return (
    <Wrapper>
      <h1>
        Transaction details
        <TitleAddress
          textToCopy={txHash}
          contentsToDisplay={<BlockExplorerLink type="tx" networkId={networkId} identifier={txHash} />}
        />
      </h1>
      <TransactionsTableWidget txHash={txHash} networkId={networkId} />
    </Wrapper>
  )
}

export default TransactionDetails
