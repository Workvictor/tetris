import styled from 'styled-components';
import { HSLA } from './index';
export const SimpleButton = styled.div`
  margin: ${({inline})=>inline ? '6px 0' : '6px auto'};
  padding: ${({square})=>square ? '15px' : '6px 15px'};  
  font-size: 18px;
  cursor: pointer;
  position: relative;

  display: ${({inline})=>inline ? 'inline-block' : 'block'};

  color: ${({color})=>color ? color : '#fff'};
  width: ${({width, square})=>width ? square ? '0px' : width : square ? '0px' : '150px'};

  background-color: ${({hsla, selected})=>hsla && HSLA(hsla).light(selected && +10).css};

  border: ${({borderWidth})=>borderWidth || 4}px solid;
  border-top-color: ${({hsla})=>hsla && HSLA(hsla).light(+25).css};
  border-left-color: ${({hsla})=>hsla && HSLA(hsla).light(+20).css};
  border-right-color: ${({hsla})=>hsla && HSLA(hsla).light(-15).css};
  border-bottom-color: ${({hsla})=>hsla && HSLA(hsla).light(-20).css};
  
  box-shadow: 1px 1px 0px ${({hsla})=>hsla && HSLA(hsla).light(+20).css}, -1px -1px 0px ${({hsla})=>hsla && HSLA(hsla).light(-20).css};

  &:active {
    text-indent: 5px;

    border-top-color: ${({hsla})=>hsla && HSLA(hsla).light(-20).css};
    border-left-color: ${({hsla})=>hsla && HSLA(hsla).light(-15).css};
    border-right-color: ${({hsla})=>hsla && HSLA(hsla).light(+20).css};
    border-bottom-color: ${({hsla})=>hsla && HSLA(hsla).light(+25).css};

  }
`;