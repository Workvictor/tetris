import { TYPES } from './actions';

export const files = (
  state = [
    {
      name: 'awake10_megaWall.mp3',
      role: 'MUSIC_title',
      content: 'audio',
      tag: 'music'
    },
    {
      name: 'Yerzmyey-The_Lady_of_Mars.mp3',
      role: 'MUSIC_gameTheme',
      content: 'audio',
      tag: 'music'
    },
    {
      name: 'generic_sounds/flagreturn.wav',
      role: 'SFX_remove',
      content: 'audio'
    },
    {
      name: 'generic_sounds/antimaterhit.wav',
      role: 'SFX_drop',
      content: 'audio'
    },
    {
      name: 'generic_sounds/Warm_Digital_Accept_Button_HP.wav',
      role: 'SFX_move',
      content: 'audio'
    },
    {
      name:
        'generic_sounds/little_robot_sound_factory_Jingle_Achievement_00.mp3',
      role: 'SFX_combo',
      content: 'audio'
    },
    {
      name: 'generic_sounds/game_hidemenu.wav',
      role: 'SFX_gameOver',
      content: 'audio'
    },
    {
      name: 'generic_sounds/explosion4.wav',
      role: 'SFX_landing',
      content: 'audio'
    },
    {
      name: 'generic_sounds/itemback.wav',
      role: 'SFX_hover',
      content: 'audio'
    },
    {
      name: 'generic_sounds/itempick1.wav',
      role: 'SFX_pick',
      content: 'audio'
    },
    {
      name: 'generic_sounds/tick.wav',
      role: 'SFX_tick',
      content: 'audio'
    }
  ],
  { type, payload }
) =>
  type === TYPES.UPDATE_FILE_INFO
    ? [
        ...state.slice(0, state.findIndex(elem => elem.name === payload.name)),
        { ...state.find(elem => elem.name === payload.name), ...payload },
        ...state.slice(state.findIndex(elem => elem.name === payload.name) + 1)
      ]
    : state;
