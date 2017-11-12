import React from 'react';
import styled from 'styled-components';
import { Wrapper } from './Wrapper';

export const Options = props => {
  const { isVisible } = props;
  return <Wrapper {...{ isVisible }}>options</Wrapper>;
};
