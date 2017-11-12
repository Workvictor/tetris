import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  padding: 10px 15px;
  background-color: #fff;
  color: #000;
  border: 2px solid #000;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;
export const MenuButton = ({ title, value, onClick }) => (
  <Wrapper onClick={() => onClick(value)}>{title}</Wrapper>
);
