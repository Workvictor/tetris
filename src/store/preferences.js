import { TYPES } from './actions';
export const preferences = (
  state = {
    MUSIC_VOLUME: 0.25,
    SFX_VOLUME: 0.25,
    MUSIC_MUTE: false,
    SFX_MUTE: false,
    RESOLUTION: 720,    
  },
  { type, payload }
) =>
    type === TYPES.SET_PREFERENCES
  ? { ...state, ...payload}
  : state;