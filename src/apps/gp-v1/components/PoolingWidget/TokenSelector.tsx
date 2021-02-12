import React from 'react'

// assets
import { TokenImgWrapper } from 'components/common/TokenImg'
import checkIcon from 'assets/img/li-check.svg'

// types
import { TokenDex } from '@gnosis.pm/dex-js'

// PoolingWidget: subcomponent
import { ProgressStepText } from 'apps/gp-v1/components/PoolingWidget/PoolingWidget.styled'
import {
  TokenSelectorWrapper,
  TokenBox,
  CheckboxWrapper,
} from 'apps/gp-v1/components/PoolingWidget/TokenSelector.styled'

export interface TokenSelectorProps {
  handleTokenSelect: (tokenData: TokenDex) => void
  selectedTokensMap: Map<number, TokenDex>
  tokens: TokenDex[]
}

const TokenSelector: React.FC<TokenSelectorProps> = ({ handleTokenSelect, selectedTokensMap, tokens }) => {
  return (
    <TokenSelectorWrapper>
      {tokens.map((tokenDetails) => {
        const { name, symbol, address, addressMainnet, id } = tokenDetails
        return (
          <TokenBox
            key={address}
            onClick={(): void => handleTokenSelect(tokenDetails)}
            $selected={selectedTokensMap.has(id)}
          >
            <CheckboxWrapper>
              {/* <FontAwesomeIcon icon={faCheckCircle} color="green" /> */}
              <img src={checkIcon} width="20" height="20" />
            </CheckboxWrapper>
            <TokenImgWrapper address={address} addressMainnet={addressMainnet} name={name} symbol={symbol} />
            <div>
              <ProgressStepText>{symbol}</ProgressStepText>
              <ProgressStepText>
                <i>{name}</i>
              </ProgressStepText>
            </div>
          </TokenBox>
        )
      })}
    </TokenSelectorWrapper>
  )
}

export default TokenSelector
