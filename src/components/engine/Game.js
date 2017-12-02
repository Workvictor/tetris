import {
  HSLA,
  STORE,
  ACTIONS,
  Grid,
  CanvasApi,
  GameInput,
  ActionFrame,
  FigureGenerator
} from './index';

export class Game {

  constructor(...props) {

    this.data = Object.assign(this.DEFAULTS, props[0]);
  }



  get DEFAULTS(){
    return {
      score:0,
      showScore:0,
      scoreStack:[],
      lineScore:10,
      linesCount:0,
      dropDelay:1000,
      spreeTimeout:1000,
      incrementCount:10,
      incrementDelay:30,
      lineMultiplier:1.2,
    }
  }

  get AUDIO() {
    return this.STATE && this.STATE.audioController;
  }

  get STATE() {
    return STORE.getState();
  }

  reset =()=> ACTIONS.updateGame(this.data)

}
