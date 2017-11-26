import React from 'react';
import { connect } from 'react-redux';
import { Wrapper } from './index';

 const ConfirmExitApp = props => {
  const { stages, stage } = props;
  return <Wrapper isVisible={stages.find(elem=>elem.id===stage).isActive}>confirm exit</Wrapper>;
};

export const ConfirmExit = connect(
  state => ({
    stages: state.stages,
  })
)(ConfirmExitApp);