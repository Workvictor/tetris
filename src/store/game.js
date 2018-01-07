import { TYPES } from './actions';
export const game = (
  state = {
    cellSize: 64,
    gridAspectRatio: 1/1,
    score: 0,
    pause: false,
    newGameStarts: false,
    scoreStack: [],
    showScore: 0,
  },
  { type, payload }
) =>
    type === TYPES.UPDATE_GAME
  ? { ...state, ...payload}
  : type === TYPES.UPDATE_SCORE_STACK
  ? { ...state, scoreStack:[
      ...state.scoreStack,
      ...payload.scoreStack
      ]
    }
  : type === TYPES.UPDATE_SHOW_SCORE
  ? { ...state, ...payload, scoreStack:[
      ...state.scoreStack.slice(0,0),
      ...state.scoreStack.slice(1),
    ]}
  : state;