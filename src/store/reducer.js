import {
  createStore,
  combineReducers,
  applyMiddleware
} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import { stages } from './stages'
import { menu } from './menu'
import { options } from './options'
import { audioController } from './audioController'
import { files } from './files'
import { preferences } from './preferences'
const AppData = combineReducers({
  menu,
  stages,
  options,
  audioController,
  files,
  preferences,
})
export const STORE = createStore(AppData, composeWithDevTools(applyMiddleware(thunk)));