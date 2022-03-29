import React from 'react'
import styled from 'styled-components'

import { Card, CardContent } from 'components/common/Card'
import { CardRow } from 'components/common/CardRow'
import { Grid } from '@material-ui/core'

const WrapperDoubleContent = styled.div`
  display: flex;
  flex-direction: column;

  > div:not(:last-child) {
    padding-bottom: 5rem;
  }
`

export function SummaryCards(): JSX.Element {
  return (
    <Grid container direction="row">
      <CardRow>
        <Card>
          <WrapperDoubleContent>
            <CardContent variant="3row" label1="Last Batch" value1="3m 42s Ago" />
            <CardContent variant="3row" label1="Batch ID" value1="fd3f932" />
          </WrapperDoubleContent>
        </Card>
      </CardRow>
      <CardRow>
        <>
          <Card>
            <CardContent variant="2row" label1="24h Transactions" value1="194" caption1="-3.45%" captionColor="red1" />
          </Card>
          <Card>
            <CardContent variant="2row" label1="Total Tokens" value1="193" />
          </Card>
          <Card>
            <CardContent variant="2row" label1="24h fees" value1="$33.3K" caption1="+1.03%" captionColor="green" />
          </Card>
          <Card>
            <CardContent variant="2row" label1="30d Surplus" value1="$53.9K" caption1="+14.43%" captionColor="green" />
          </Card>
        </>
      </CardRow>
    </Grid>
  )
}
