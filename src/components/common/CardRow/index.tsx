import React from 'react'
import Grid, { GridProps } from '@material-ui/core/Grid'

export type CardRowProps = { children?: React.ReactElement }

/**
 * CardRow component.
 *
 * Place cards side-by-side
 */
export const CardRow: React.FC<GridProps> = ({ children, ...rest }) => {
  return (
    <Grid container {...rest}>
      {children}
    </Grid>
  )
}
