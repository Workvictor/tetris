import styled from 'styled-components';
import { HSLA } from './index';
export const SimpleWindow = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 12px;
  text-align: center;
  color: ${({color, hsla})=>color ? color : hsla ? HSLA(hsla).light(+90).css : '#fff'};
  width: ${({width})=>width ? width : '100%'};

  background-color: ${({hsla})=>hsla && HSLA(hsla).css};
  
  border: ${({borderWidth})=>borderWidth || 4}px solid;
  border-top-color: ${({hsla})=>hsla && HSLA(hsla).light(+25).css};
  border-left-color: ${({hsla})=>hsla && HSLA(hsla).light(+20).css};
  border-right-color: ${({hsla})=>hsla && HSLA(hsla).light(-15).css};
  border-bottom-color: ${({hsla})=>hsla && HSLA(hsla).light(-20).css};
`;