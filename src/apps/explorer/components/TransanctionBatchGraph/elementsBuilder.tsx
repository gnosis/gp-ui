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

  build(): ElementDefinition[] {
    if (!this._center) {
      throw new Error('Center node is required')
    }

    const thirdOfTotalRows = Math.max(...this._countTypes.values()) / 3
    const center = {
      ...this._center,
      position: { x: 100, y: 0 },
    }
    center['data']['rowValue'] = Math.floor(thirdOfTotalRows)

    const r = this._SIZE / 2 - 100

    const nodes = this._nodes.map((node, index) => {
      return {
        ...node,
        position: {
          x: r * Math.cos((2 * Math.PI * index) / this._nodes.length),
          y: r * Math.sin((2 * Math.PI * index) / this._nodes.length),
        },
      }
    })

    return [center, ...nodes, ...this._edges]
  }

  getById(id: string): ElementDefinition | undefined {
    // split type:id and find by id
    if (this._center) {
      return [this._center, ...this._nodes].find((node) => node.data.id?.split(':')[1] === id)
    }

    return this._nodes.find((node) => node.data.id?.split(':')[1] === id)
  }
}

const columnTypeMap = new Map<TypeNodeOnTx, number>([
  [TypeNodeOnTx.Trader, 0],
  [TypeNodeOnTx.CowProtocol, 1],
  [TypeNodeOnTx.Dex, 2],
])

interface GridPosition {
  x: number
  y: number
}
export function getGridPosition(type: TypeNodeOnTx, index: number): undefined | GridPosition {
  if (!columnTypeMap.has(type)) return

  let col
  const row = index
  if (type === TypeNodeOnTx.Trader) {
    col = 0
  } else if (type === TypeNodeOnTx.CowProtocol) {
    col = 1
  } else {
    col = 2
  }
  return { y: row, x: col }
}
