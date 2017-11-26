export class GameInput {
  constructor(keyHandlers) {

    this.keyHandlers = keyHandlers;
    this.pressed = null;
    this.debug = false;

  }

  onLeftClick = e => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };
  
  onRightClick= e => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  set debugMode(state){
    this.debug = state;
  }

  activate=()=>{
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('click', this.onLeftClick);
    window.addEventListener('contextmenu', this.onRightClick);
  }

  deactivate=()=>{
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('click', this.onLeftClick);
    window.removeEventListener('contextmenu', this.onRightClick);
  }

  debugKey=(e)=>{
    if (this.debug){
      console.log('--- key debugger ---');
      console.log('Event: ', e);
      console.log('Event key: ', e.key);
      console.log('Event code: ', e.code);
      console.log('Event keyCode: ', e.keyCode);
      console.log('--- key debugger ---');
    }
  }

  onKeyDown = e => {
    const { key, code } = e;
    this.debugKey(e);
    e.preventDefault();
    e.stopPropagation();
    this.keyHandlers && this.keyHandlers[code] && this.keyHandlers[code]();
    this.pressed = code;
  };

  onKeyUp = e => {
    e.preventDefault();
    e.stopPropagation();
    this.pressed = null;
  };
}
