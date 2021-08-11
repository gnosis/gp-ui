import styled from 'styled-components'

import { SimpleTable, Props as SimpleTableProps } from 'components/common/SimpleTable'

interface Props {
  showBorderTable?: boolean
}

export type StyledUserDetailsTableProps = SimpleTableProps & Props

const StyledUserDetailsTable = styled(SimpleTable)<StyledUserDetailsTableProps>`
  border: ${({ theme, showBorderTable }): string => (showBorderTable ? `0.1rem solid ${theme.borderPrimary}` : 'none')};
  border-radius: 0.4rem;

  tr td {
    &:not(:first-of-type) {
      text-align: right;
    }

    &.long {
      border-left: 0.2rem solid var(--color-long);
    }

    &.short {
      color: var(--color-short);
      border-left: 0.2rem solid var(--color-short);
    }
  }

  thead tr th {
    color: white;
    font-style: normal;
    font-weight: 800;
    font-size: 13px;
    line-height: 16px;
    height: 50px;
    border-bottom: ${({ theme }): string => `1px solid ${theme.borderPrimary}`};
  }

  tbody tr:hover {
    backdrop-filter: contrast(0.9);
  }

  .span-copybtn-wrap {
    display: block;
  }
`

export default StyledUserDetailsTable
