export { OutboundLink as default } from 'react-ga'

// import React, { PropsWithChildren, useCallback } from 'react'
// import { OutboundLink, OutboundLinkProps } from 'react-ga'

// type OutboundLinkPropsWithOptionalLabel = Exclude<OutboundLinkProps, 'eventLabel'> & {
//   eventLabel?: string
// }

// type Props = PropsWithChildren<OutboundLinkPropsWithOptionalLabel>

// export const ExternalLink: React.FC<Props> = (props: Props) => {
//   const { eventLabel, children, to, onClick } = props

//   const outboundProps = {
//     ...props,
//     // eslint-disable-next-line @typescript-eslint/ban-types
//     onClick: onClick as Function,
//     eventLabel: eventLabel || to,
//   } as OutboundLinkProps

//   return <OutboundLink {...outboundProps}>{children}</OutboundLink>
// }
