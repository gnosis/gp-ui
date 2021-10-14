import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { faCopy } from '@fortawesome/free-regular-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CopyToClipboard from 'react-copy-to-clipboard'

import { DISPLAY_TEXT_COPIED_CHECK } from 'apps/explorer/const'

// Why is `copied` not a boolean?
//   Because it's passed down to parent component (`FontAwesomeIcon`) and
// since it's not consumed in the component, it's passed down to the HTML.
//   Which does not like to receive boolean values, with an error like:
// "Warning: Received `false` for a non-boolean attribute `copied`"
//   Effectively though, it's treated as a boolean, thus the value doesn't matter
const Icon = styled(FontAwesomeIcon)<{ copied?: string }>`
  color: ${({ theme, copied }): string => (copied ? theme.green : theme.grey)};
  transition: color 0.2s ease-in;
  cursor: ${({ copied }): string => (copied ? 'reset' : 'pointer')};
  vertical-align: top;

  &:hover {
    color: ${({ theme, copied }): string => (copied ? theme.green : theme.white)};
  }

  + span {
    color: ${({ theme }): string => theme.green};
    font-weight: ${({ theme }): string => theme.fontMedium};
    margin: 0 0 0 0.1rem;
  }
`

export type Props = { text: string; onCopy?: (value: string) => void }

/**
 * Simple CopyButton component.
 *
 * Takes in the `text` to be copied when button is clicked
 * Displays the copy icon with theme based color
 * When clicked, displays a green check for DISPLAY_TEXT_COPIED_CHECK seconds,
 * then is back to original copy icon
 */
export function CopyButton(props: Props): JSX.Element {
  const { text, onCopy } = props

  const [copied, setCopied] = useState(false)
  const handleOnCopy = (): void => {
    setCopied(true)
    onCopy && onCopy(text)
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null

    if (copied) {
      timeout = setTimeout(() => setCopied(false), DISPLAY_TEXT_COPIED_CHECK)
    }

    return (): void => {
      timeout && clearTimeout(timeout)
    }
  }, [copied])

  return (
    <CopyToClipboard text={text} onCopy={handleOnCopy}>
      <span>
        <Icon icon={copied ? faCheck : faCopy} copied={copied ? 'true' : undefined} />{' '}
        {copied && <span className="copy-text">Copied</span>}
      </span>
    </CopyToClipboard>
  )
}
