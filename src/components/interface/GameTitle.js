import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  text-align: center;
  left: 0;
  margin: 6px auto;
  padding: 12px;
  color: #000000;
  border: 1px solid #000;
  font-size: 32px;
  -webkit-transition: all 300ms;
  transition: all 300ms;
  z-index: 999;
  text-shadow: 0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff;
  top: ${ ({isVisible})=>isVisible? '0' : '-100px' };
`;
export const GameTitleApp = ({ stages, stage }) => (
  <Wrapper isVisible={stages.find(elem=>elem.id===stage).isActive}>Tetris</Wrapper>
);
export const GameTitle = connect(
  state => ({
    stages: state.stages,
    menu: state.menu
  })
)(GameTitleApp);