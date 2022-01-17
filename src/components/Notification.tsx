import React, { useState } from 'react'
import styled from 'styled-components'
import { transparentize } from 'polished'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamation } from '@fortawesome/free-solid-svg-icons'

interface NotificationProps {
  type: string
  message: string
}

export const NotificationWrap = styled.p<{ isActive?: boolean; type: string }>`
  border-radius: 4px;
  padding: 10px 15px;
  background-color: ${({ theme }): string => transparentize(0.8, theme.red4)};
  font-size: 12px;
  display: ${({ isActive }): string => (isActive ? 'flex' : 'none')};
  align-items: center;

  button {
    cursor: pointer;
    border: 0;
    background-color: transparent;
    background-image: none;
    padding: 0;
    width: 40px;
    min-height: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: relative;
    &:before,
    &:after {
      content: '';
      display: block;
      width: 20px;
      height: 2px;
      background-color: ${({ theme }): string => theme.textPrimary1};
      position: absolute;
    }
    &:after {
      transform: rotate(-45deg);
      left: 50%;
    }
    &:before {
      left: 50%;
      transform: rotate(45deg);
    }
  }

  span {
    flex-grow: 1;
    margin: 0 20px;
  }
`

const IconCircle = styled.p`
  width: 20px;
  height: 20px;
  padding: 2px;
  border: 2px solid ${({ theme }): string => theme.red4};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  svg,
  svg.svg-inline--fa {
    color: ${({ theme }): string => theme.red4};
    width: 10px;
    height: 11px;
  }
`

export const Notification: React.FC<NotificationProps> = ({ type, message }: NotificationProps) => {
  const [isNoteActive, setIsNoteActive] = useState(true)

  return (
    <NotificationWrap type={type} isActive={isNoteActive}>
      <IconCircle>
        <FontAwesomeIcon icon={faExclamation} />
      </IconCircle>
      <span>{message}</span>
      <button onClick={(): void => setIsNoteActive(false)} />
    </NotificationWrap>
  )
}
