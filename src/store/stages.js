import { TYPES } from './actions';
export const stages = (
  state = [
    {
      title: 'Game',
      id: 'game',
      isActive: false
    },
    {
      title: 'Options',
      id: 'options',
      isActive: false
    },
    {
      title: 'LoadingScreen',
      id: 'fileLoader',
      isActive: false
    },
    {
      title: 'Exit',
      id: 'exit',
      isActive: false
    },
    {
      title: 'Menu',
      id: 'menu',
      isActive: false
    }
  ],
  { type, payload }
) =>
    type === TYPES.SET_STAGE
  ? [...state.map(elem => ({ ...elem, isActive: elem.id === payload.id }))]
  : state;
