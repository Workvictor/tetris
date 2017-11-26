import styled from 'styled-components';
import { HSLA } from './index';
export const Display = styled.div`  
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  overflow: hidden;
  border: 4px solid;
  border-top-color: #1a271c;
  border-left-color: #1a271c;
  border-right-color: #1a271c;
  border-bottom-color: #223325;
  box-shadow: 0 0px 190px 1px #01460c, 0 0px 0px 1px #014c0d;
  &:after{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow: inset 0 0 16px #000, 
                inset 0 0 64px #000;
  }
`;

export const DisplayBottomWidget = styled.div`
  padding: 8px 12px;
  position: relative;
  border: 4px solid;
  top: 0px;
  border-top-color: #1a271c00;
  border-left-color: #1a271c;
  border-right-color: #1a271c;
  border-bottom-color: #2d4030;
  box-shadow: 0 0px 190px 1px #01460c, 0 1px 0px 1px #014c0d;
  background: #1f3523;
`