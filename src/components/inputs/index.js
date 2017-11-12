export class GameInput {
  constructor() {
    this.listener = {
      keyDown: null,
      keyUp: null
    };
    this.pressed = null;
    window.focus();
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('click', this.onMouseClick);
    window.addEventListener('contextmenu', this.onMouseClick);
  }
  set keyDownHandler(handler) {
    this.listener.keyDown = handler;
  }
  set keyUpHandler(handler) {
    this.listener.keyUp = handler;
  }
  onMouseClick = e => {
    e.preventDefault();
    e.stopPropagation();
    // console.log(e);
    return false;
  };
  onKeyDown = e => {
    // console.log(e.keyCode);
    e.preventDefault();
    e.stopPropagation();
    this.pressed = e.keyCode;
    this.listener.keyDown && this.listener.keyDown(this.pressed);
  };
  onKeyUp = e => {
    e.preventDefault();
    e.stopPropagation();    
    this.pressed = null;
    this.listener.keyUp && this.listener.keyUp(this.pressed);
  };
  get key() {
    return this.pressed;
  }
}
