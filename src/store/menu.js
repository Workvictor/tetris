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
        role: 'MUSIC_gameTheme',
      },
      {
        title: 'Save & Exit',
        id: 'exit',
        role: 'MUSIC_gameTheme',
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