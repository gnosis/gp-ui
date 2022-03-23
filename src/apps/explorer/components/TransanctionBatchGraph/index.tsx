import Cytoscape, {
  ElementDefinition,
  NodeSingular,
  NodeDataDefinition,
  EdgeDataDefinition,
  EventObject,
} from 'cytoscape'
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
import BigNumber from 'bignumber.js'

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
  const alias = account.alias === ALIAS_TRADER_NAME ? abbreviateString(address, 4, 4) : account.alias

  return { ...account, alias }
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
    const token = txSettlement.tokens[transfer.token]
    const tokenSymbol = token?.symbol || 'UNKNOW'
    const tokenAmount = token?.decimals
      ? new BigNumber(transfer.value).div(new BigNumber(10).pow(token.decimals)).toFixed(2)
      : '-'

    const source = builder.getById(transfer.from)
    const target = builder.getById(transfer.to)
    builder.edge(
      { type: source?.data.type, id: transfer.from },
      { type: target?.data.type, id: transfer.to },
      `${tokenSymbol}`,
      { from: transfer.from, to: transfer.to, amount: `${tokenAmount} ${tokenSymbol}` },
    )
  })

  return builder.build(
    buildGridLayout(builder._countTypes as Map<TypeNodeOnTx, number>, builder._center, builder._nodes),
  )
}

function bindPopper(event: EventObject, targetData: Cytoscape.NodeDataDefinition | Cytoscape.EdgeDataDefinition): void {
  const tooltipId = `popper-target-${targetData.id}`
  const existingTarget = document.getElementById(tooltipId)

  // Remove if already existing
  if (existingTarget) {
    existingTarget.remove()
  }

  const target = event.target
  const popperRef = target.popper({
    content: () => {
      const tooltip = document.createElement('span')
      tooltip.id = tooltipId
      tooltip.classList.add('target-popper')

      const table = document.createElement('table')
      tooltip.append(table)

      // loop through target data [tooltip]
      for (const prop in targetData.tooltip) {
        const targetValue = targetData.tooltip[prop]

        // no recursive or reduce support
        if (typeof targetValue === 'object') continue

        const tr = table.insertRow()

        const tdTitle = tr.insertCell()
        const tdValue = tr.insertCell()

        tdTitle.innerText = prop
        tdValue.innerText = targetValue
      }

      document.body.appendChild(tooltip)

      return tooltip
    },
    popper: {
      placement: 'top-start',
      removeOnDestroy: true,
    },
  })

  const popperUpdate = (): (() => void) => popperRef.update()

  target.on('position', () => popperUpdate)
  target.cy().on('pan zoom resize', () => popperUpdate)
  const newTarget = document.getElementById(tooltipId)
  target
    .on('click tapstart', () => {
      if (newTarget) {
        newTarget.classList.add('active')
      }
    })
    .on('mouseout tapend', () => {
      if (newTarget) {
        newTarget.remove()
      }
    })
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
  }, [error, isLoading, networkId, txSettlement])

  useEffect(() => {
    const cy = cytoscapeRef.current
    if (!cy || !elements.length) return

    cy.on('click tapstart', 'edge', (event): void => {
      const target = event.target
      const targetData: NodeDataDefinition | EdgeDataDefinition = target.data()

      bindPopper(event, targetData)
    })
    cy.on('mouseover', 'edge', (event): void => {
      event.target.addClass('hover')
    })
    cy.on('mouseout', 'edge', (event): void => {
      event.target.removeClass('hover')
    })
  }, [cytoscapeRef, elements.length])

  if (isLoading) return <Spinner spin size="3x" />

  const layout = {
    name: 'grid',
    position: function (node: NodeSingular): { row: number; col: number } {
      return { row: node.position('y'), col: node.position('x') }
    },
    fit: true, // whether to fit the viewport to the graph
    padding: 10, // padding used on fit
    avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
    avoidOverlapPadding: 10, // extra spacing around nodes when avoidOverlap: true
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
      className="tx-graph"
    />
  )
}

export default TransanctionBatchGraph
