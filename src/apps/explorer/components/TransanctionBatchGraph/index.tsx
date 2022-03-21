import Cytoscape, { ElementDefinition, NodeSingular } from 'cytoscape'
import popper from 'cytoscape-popper'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import styled from 'styled-components'

import Spinner from 'components/common/Spinner'
import { GetTxBatchTradesResult as TxBatchData, Settlement as TxSettlement } from 'hooks/useTxBatchTrades'
import { networkOptions } from 'components/NetworkSelector'
import { Network } from 'types'
import { Account, ALIAS_TRADER_NAME } from 'api/tenderly'
import ElementsBuilder, { buildGridLayout } from 'apps/explorer/components/TransanctionBatchGraph/elementsBuilder'
import { TypeNodeOnTx } from './types'
import { APP_NAME } from 'const'
import { HEIGHT_HEADER_FOOTER } from 'apps/explorer/const'
import { STYLESHEET } from './styled'
import { abbreviateString } from 'utils'

Cytoscape.use(popper)
const HEIGHT_SIZE = window.innerHeight - HEIGHT_HEADER_FOOTER
const PROTOCOL_NAME = APP_NAME
const WrapperCytoscape = styled(CytoscapeComponent)`
  background-color: ${({ theme }): string => theme.bg1};
  font-weight: ${({ theme }): string => theme.fontMedium};
  border: 0.1rem solid ${({ theme }): string => theme.borderPrimary};
  border-radius: 0.4rem;
`

function getTypeNode(account: Account): TypeNodeOnTx {
  let type = TypeNodeOnTx.Dex
  if (account.alias === ALIAS_TRADER_NAME) {
    type = TypeNodeOnTx.Trader
  } else if (account.alias === PROTOCOL_NAME) {
    type = TypeNodeOnTx.CowProtocol
  }

  return type
}

function showTraderAddress(account: Account, address: string): Account {
  if (account.alias === ALIAS_TRADER_NAME) {
    account.alias = abbreviateString(address, 4, 4)
  }
  return account
}

function getNetworkParentNode(account: Account, networkName: string): string | undefined {
  return account.alias !== ALIAS_TRADER_NAME ? networkName : undefined
}

function getNodes(txSettlement: TxSettlement, networkId: Network): ElementDefinition[] {
  if (!txSettlement.accounts) return []

  const networkName = networkOptions.find((network) => network.id === networkId)?.name.toLowerCase()
  const networkNode = { alias: networkName || '' }
  const builder = new ElementsBuilder(HEIGHT_SIZE)
  builder.node({ type: TypeNodeOnTx.NetworkNode, entity: networkNode, id: networkNode.alias })

  for (const key in txSettlement.accounts) {
    const account = txSettlement.accounts[key]
    const parentNodeName = getNetworkParentNode(account, networkNode.alias)

    if (getTypeNode(account) === TypeNodeOnTx.CowProtocol) {
      builder.center({ type: TypeNodeOnTx.CowProtocol, entity: account, id: key }, parentNodeName)
    } else {
      builder.node(
        {
          id: key,
          type: getTypeNode(account),
          entity: showTraderAddress(account, key),
        },
        parentNodeName,
      )
    }
  }

  txSettlement.transfers.forEach((transfer) => {
    const token = txSettlement.tokens[transfer.token] || { decimals: 1, symbol: 'UNKNOW' }

    const source = builder.getById(transfer.from)
    const target = builder.getById(transfer.to)
    builder.edge(
      { type: source?.data.type, id: transfer.from },
      { type: target?.data.type, id: transfer.to },
      `${token.symbol}`,
    )
  })

  return builder.build(
    buildGridLayout(builder._countTypes as Map<TypeNodeOnTx, number>, builder._center, builder._nodes),
  )
}

interface GraphBatchTxParams {
  txBatchData: TxBatchData
  networkId: Network | undefined
}

function TransanctionBatchGraph({
  txBatchData: { error, isLoading, txSettlement },
  networkId,
}: GraphBatchTxParams): JSX.Element {
  const [elements, setElements] = useState<ElementDefinition[]>([])
  const cytoscapeRef = useRef<Cytoscape.Core | null>(null)
  const setCytoscape = useCallback(
    (ref: Cytoscape.Core) => {
      cytoscapeRef.current = ref
    },
    [cytoscapeRef],
  )

  useEffect(() => {
    if (error || isLoading || !networkId) return

    setElements(getNodes(txSettlement, networkId))
    const cy = cytoscapeRef.current
    if (cy) {
      cy.on('click', 'node', (_event): void => {
        const node = _event.target
        const popper = node.popper({
          content: () => {
            const div = document.createElement('div')
            div.innerHTML = 'Popper Node tooltip'
            document.body.appendChild(div)
            return div
          },
          popper: {
            placement: 'top',
          }, // my popper options here
        })
        const update = (): void => {
          popper.update()
        }

        node.on('position', update)

        cy.on('pan zoom resize', update)
      })
    }
  }, [error, isLoading, networkId, txSettlement])

  if (isLoading) return <Spinner spin size="3x" />

  const layout = {
    name: 'grid',
    position: function (node: NodeSingular): { row: number; col: number } {
      return { row: node.position('y'), col: node.position('x') }
    },
    fit: true, // whether to fit the viewport to the graph
    padding: 10, // padding used on fit
    avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
    avoidOverlapPadding: 100, // extra spacing around nodes when avoidOverlap: true
    nodeDimensionsIncludeLabels: false,
  }

  return (
    <WrapperCytoscape
      elements={elements}
      layout={layout}
      style={{ width: '100%', height: HEIGHT_SIZE }}
      stylesheet={STYLESHEET}
      cy={setCytoscape}
      wheelSensitivity={0.2}
    />
  )
}

export default TransanctionBatchGraph
