export class ActionFrame {

  constructor(){
    this.requestID = null;
    this.frame = null;
    this.running = false;
  }

  run=(t)=>{
    this.running && this.frame && this.frame(t);
    this.requestID = window.requestAnimationFrame(this.run);
  }

  loop=(t)=> this.frame ? this.run(t) : this.stop();

  get pause() {
    return this.running;
  }

  set pause(value) {
    this.running = !value;
  }

  stop=()=> {
    this.frame = null;
    window.cancelAnimationFrame(this.requestID);
  }

  init=(GAME_LOOP)=> {
    this.frame = GAME_LOOP;
    this.running = true;
    this.frame && this.run(0);
  }

}