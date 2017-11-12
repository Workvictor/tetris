import React from 'react';
import styled from 'styled-components';
import { Wrapper } from './Wrapper';

export const GameContent = props => {
  const { isVisible } = props;
  return <Wrapper {...{ isVisible }}>GameContent</Wrapper>;
};