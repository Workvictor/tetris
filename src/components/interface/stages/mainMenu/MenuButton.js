import React from 'react';
import { connect } from 'react-redux';
import { SimpleButton, HSLA, ACTIONS } from './index';

const MenuButtonApp = ({
  id,
  role,
  title,
  selected,
  clickMenuID,
  selectMenuID,
  resetMenuSelection,
}) => {
  return (
    <SimpleButton
      hsla={HSLA(210)}
      selected={selected===id}
      onClick={() => clickMenuID({ id, role })}
      onMouseEnter={() => selectMenuID({ id })}
      onMouseLeave={() => resetMenuSelection()}
    >
      {title}
    </SimpleButton>
  );
};

export const MenuButton = connect(
  state => ({
    selected: state.menu.selected,
  }),
  dispatch => ({
    selectMenuID: data => dispatch(ACTIONS.selectMenuID(data)),
    resetMenuSelection: data => dispatch(ACTIONS.resetMenuSelection(data)),
    clickMenuID: data => dispatch(ACTIONS.clickMenuID(data)),
  })
)(MenuButtonApp);
