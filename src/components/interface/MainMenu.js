import React from 'react';
import styled from 'styled-components';
import { MenuButton } from './MenuButton';
import { defaultOptions } from '../index';
import { Wrapper } from './Wrapper';

const { mainMenu } = defaultOptions;

const MenuWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 320px;
  padding: 12px;
  color: #fff;
  text-align: center;
  background-color: hsla(0, 0%, 0%, 0.65);
`;

const onMenuClick = key => console.log(key);

export const MainMenu = ({isVisible}) => (
  <Wrapper {...{isVisible}}>
    <MenuWrapper>
      Main Menu
      {mainMenu.map((elem, id) => (
        <MenuButton
          key={id}
          value={elem.value}
          title={elem.title}
          onClick={onMenuClick}
        />
      ))}
    </MenuWrapper>
  </Wrapper>
);
