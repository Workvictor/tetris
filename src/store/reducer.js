import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { menu } from './menu';
import { game } from './game';
import { files } from './files';
import { stages } from './stages';
import { options } from './options';
import { preferences } from './preferences';
import { audioController } from './audioController';
const AppData = combineReducers({
  menu,
  game,
  files,
  stages,
  options,
  preferences,
  audioController,
});
export const STORE = createStore(
  AppData,
  composeWithDevTools(applyMiddleware(thunk))
);
