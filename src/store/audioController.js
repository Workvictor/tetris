import { TYPES } from './actions';
export const audioController = (
  state = {},
  { type, payload }
) =>
    type === TYPES.SET_AUDIO_CONTROLLER
  ? payload
  : type === TYPES.SET_LOADER_PROGRESS
  ? { ...state, loadingProgress: payload}
  : type === TYPES.TOGGLE_MUSIC_MUTE
  ? { ...state, MUSIC_MUTE: !state.MUSIC_MUTE}
  : state;