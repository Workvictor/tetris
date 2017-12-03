import { TYPES } from './actions';
export const menu = (
  state = {
    selected: 0,
    items: [
      {
        title: 'Game',
        id: 'game',
        tags: ['onStart'],
        role: 'MUSIC_gameTheme',
      },
      {
        title: 'Options',
        id: 'options',
      },
      {
        title: 'Save & Exit',
        id: 'exit',
      }
    ]
  },
  { type, payload }
) => 
    type === TYPES.SELECT_MENU_ID
  ? { ...state, selected: payload.id }
  : type === TYPES.RESET_MENU_SELECTION
  ? { ...state, selected: 0 }
  : state;