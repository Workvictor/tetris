import React from 'react';
import styled from 'styled-components';
import { Wrapper } from './Wrapper';

export const ConfirmExit = props => {
  const { isVisible } = props;
  return <Wrapper {...{ isVisible }}>confirm exit</Wrapper>;
};
