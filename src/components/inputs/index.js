export class GameInput {
  constructor(keyHandlers) {

    this.keyHandlers = keyHandlers;
    this.codePressed = null;
    this.debug = false;
    this.keyCode = [];

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

  isKeyCode=some=>this.keyCode.includes(some);

  get vector(){
    const isKeyCode=some=>this.keyCode.includes(some);
    const x = isKeyCode(37) ? -1 : isKeyCode(39) ? +1 : 0;
    const y = isKeyCode(38) ? -1 : isKeyCode(40) ? +1 : 0;
    return{
      x,y
    }
  }

  get rotation(){

    const direction = this.isKeyCode(38)||this.isKeyCode(69) ? 1 : this.isKeyCode(81) ? -1 : 0;

    return{
      direction
    }
  }

  reset=()=>{
    this.keyCode=[];
    this.codePressed = null;
  }

  onKeyDown = e => {
    const { key, code, keyCode } = e;
    this.debugKey(e);
    e.preventDefault();
    e.stopPropagation();

    this.codePressed !== code &&
    this.keyHandlers &&
    this.keyHandlers[code] &&
    this.keyHandlers[code]();

    !this.keyCode.includes(keyCode) &&
    this.keyCode.push(keyCode)

    this.codePressed = code;
  };

  onKeyUp = e => {
    const { key, code, keyCode } = e;
    e.preventDefault();
    e.stopPropagation();
    this.codePressed = null;
    const index = this.keyCode.findIndex(elem=>elem===keyCode);
    this.keyCode = [
      ...this.keyCode.slice(0, index),
      ...this.keyCode.slice(index+1),
    ];
  };
}
