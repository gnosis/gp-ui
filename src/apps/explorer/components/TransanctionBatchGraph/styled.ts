import { Stylesheet } from 'cytoscape'

import TraderOtherIcon from 'assets/img/TraderOther.svg'
import CowProtocolIcon from 'assets/img/CoW.svg'
import DexIcon from 'assets/img/Dex.svg'

export const STYLESHEET: Stylesheet[] = [
  {
    selector: 'node[label]',
    style: {
      label: 'data(label)',
      color: '#cfcfcf',
      height: 50,
      width: 50,
      'background-color': '#22232d',
    },
  },

  {
    selector: 'edge[label]',
    style: {
      label: 'data(label)',
      width: 3,
      'target-arrow-shape': 'triangle',
      'target-arrow-color': '#979dbf',
      'curve-style': 'unbundled-bezier',
      color: 'black',
      'line-color': '#747a9e',
      'line-opacity': 0.8,
      'text-background-color': 'white',
      'text-background-opacity': 1,
      'text-background-padding': '2px',
      'text-background-shape': 'roundrectangle',
      'font-size': '11px',
    },
  },
  {
    selector: 'edge.hover',
    style: {
      width: 4,
      'line-color': '#D96D49',
      'target-arrow-color': '#D96D49',
    },
  },
  {
    selector: 'node[type="trader"]',
    style: {
      'background-image': `url(${TraderOtherIcon})`,
      'text-valign': 'bottom',
      'text-margin-y': 8,
    },
  },
  {
    selector: 'node[type="dex"]',
    style: {
      'background-image': `url(${DexIcon})`,
      'text-max-width': '5rem',
      'text-valign': 'bottom',
      'text-margin-y': 8,
    },
  },
  {
    selector: 'node[type="cowProtocol"]',
    style: {
      'background-image': `url(${CowProtocolIcon})`,
      'text-valign': 'bottom',
      'text-margin-y': 8,
    },
  },
  {
    selector: 'node[type="networkNode"]',
    style: {
      'border-style': 'dashed',
      'border-opacity': 0.8,
    },
  },
]
