import { TYPES } from './actions';
export const options = (
  state = {
    volume: 0.25,
    playerName: 'guru'
  },
  { type, payload }
) =>
    type === TYPES.SET_OPTION
  ? { ...state, [payload.key]: payload.value}
  : state;