import { ElementDefinition } from 'cytoscape'
import { Node, TypeNodeOnTx } from './types'

export default class ElementsBuilder {
  _center: ElementDefinition | null = null
  _nodes: ElementDefinition[] = []
  _edges: ElementDefinition[] = []
  _SIZE: number
  _countTypes: Map<string, number>

  constructor(heighSize?: number) {
    this._SIZE = heighSize || 600
    this._countTypes = new Map()
  }

  _increaseCounType = (_type: string): void => {
    const count = this._countTypes.get(_type) || 0
    this._countTypes.set(_type, count + 1)
  }
  _createNodeElement = (node: Node, parent?: string): ElementDefinition => {
    this._increaseCounType(node.type)
    return {
      group: 'nodes',
      data: {
        id: `${node.type}:${node.id}`,
        label: node.entity.alias,
        type: node.type,
        parent: parent ? `${TypeNodeOnTx.NetworkNode}:${parent}` : undefined,
      },
    }
  }

  center(node: Node, parent?: string): this {
    this._center = this._createNodeElement(node, parent)
    return this
  }

  node(node: Node, parent?: string): this {
    this._nodes.push(this._createNodeElement(node, parent))
    return this
  }

  edge(source: Pick<Node, 'type' | 'id'>, target: Pick<Node, 'type' | 'id'>, label: string): this {
    this._edges.push({
      group: 'edges',
      data: {
        id: `${source.type}:${source.id}->${target.type}:${target.id}`,
        source: `${source.type}:${source.id}`,
        target: `${target.type}:${target.id}`,
        label,
      },
    })
    return this
  }

  build(customLayoutNodes?: CustomLayoutNodes): ElementDefinition[] {
    if (!customLayoutNodes) {
      return this._buildCoseLayout()
    } else {
      const { center, nodes } = customLayoutNodes
      return [center, ...nodes, ...this._edges]
    }
  }

  _buildCoseLayout(): ElementDefinition[] {
    if (!this._center) {
      throw new Error('Center node is required')
    }
    const center = {
      ...this._center,
      position: { x: 0, y: 0 },
    }
    const nTypes = this._countTypes.size

    const r = this._SIZE / nTypes - 100 // get radio

    const nodes = this._nodes.map((node: ElementDefinition, index: number) => {
      return {
        ...node,
        position: {
          x: r * Math.cos((nTypes * Math.PI * index) / this._nodes.length),
          y: r * Math.sin((nTypes * Math.PI * index) / this._nodes.length),
        },
      }
    })

    return [center, ...nodes, ...this._edges]
  }

  getById(id: string): ElementDefinition | undefined {
    // split <type>:<id> and find by <id>
    if (this._center) {
      return [this._center, ...this._nodes].find((node) => node.data.id?.split(':')[1] === id)
    }

    return this._nodes.find((node) => node.data.id?.split(':')[1] === id)
  }
}

interface CustomLayoutNodes {
  center: ElementDefinition
  nodes: ElementDefinition[]
}

export function getGridPosition(type: TypeNodeOnTx): number {
  let col
  if (type === TypeNodeOnTx.Trader) {
    col = 0
  } else if (type === TypeNodeOnTx.CowProtocol) {
    col = 4
  } else {
    col = 8
  }
  return col
}

export function buildGridLayout(
  countTypes: Map<TypeNodeOnTx, number>,
  center: ElementDefinition | null,
  nodes: ElementDefinition[],
): { center: ElementDefinition; nodes: ElementDefinition[] } {
  if (!center) {
    throw new Error('Center node is required')
  }
  const maxRows = Math.max(...countTypes.values())
  const middleOfTotalRows = Math.floor(maxRows / 2)
  const _center = {
    ...center,
    position: { y: middleOfTotalRows, x: getGridPosition(center.data.type) },
  }

  const traders = countTypes.get(TypeNodeOnTx.Trader) || 0
  const dexes = countTypes.get(TypeNodeOnTx.Dex) || 0
  let counterRows = { [TypeNodeOnTx.Trader]: 0, [TypeNodeOnTx.Dex]: 0 }
  if (traders > dexes) {
    const difference = (traders - dexes) / 2
    counterRows[TypeNodeOnTx.Dex] = Math.floor(difference)
  } else if (traders < dexes) {
    const difference = (dexes - traders) / 2
    counterRows[TypeNodeOnTx.Trader] = Math.floor(difference)
  }

  const _nodes = nodes.map((node) => {
    const _node = {
      ...node,
      position: {
        y: counterRows[node.data.type],
        x: getGridPosition(node.data.type),
      },
    }

    if (node.data.type === TypeNodeOnTx.Trader) {
      counterRows = { ...counterRows, [TypeNodeOnTx.Trader]: counterRows[TypeNodeOnTx.Trader] + 1 }
    } else if (node.data.type === TypeNodeOnTx.Dex) {
      counterRows = { ...counterRows, [TypeNodeOnTx.Dex]: counterRows[TypeNodeOnTx.Dex] + 1 }
    }

    return _node
  })

  return { center: _center, nodes: _nodes }
}
