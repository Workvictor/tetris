import React from 'react';
import styled from 'styled-components';
import { MainMenu } from './index';

const defaultOptions = {
  fixedTileSize: false,
  displayResolution: 0,
  defaultResolutions: [[960, 540], [1280, 720], [1920, 1080]],
  mainMenu: [
    {
      title: 'Game',
      value: 'game'
    },
    {
      title: 'Options',
      value: 'options'
    },
    {
      title: 'Exit',
      value: 'exit'
    }
  ]
};

const Wrapper = styled.div`
  padding: 12px;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  width: 100%;
  background-color: hsla(0, 0%, 0%, 0.75);
  position: fixed;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  z-index: ${({ isVisible }) => (isVisible ? 10 : -10)};
  text-align: center;
  transition: all 100ms ease-out;
`;

export const Options = () => {
  const { mainMenu } = defaultOptions;
  return (
    <Wrapper {...{ isVisible: true }}>
      Main Menu
      <MainMenu {...{ mainMenu }} />
    </Wrapper>
  );
};
