export class Timer {
  constructor({
    handlers = [{
      name:'handler',
      handler:()=>{},
      delay: 100
    }]
  }){
    this.handlers = handlers;
    this.timers = this.handlers.map(elem=>elem.delay);
  }

  reset=(name='handler')=>{
    const id = this.handlers.findIndex(handler=>handler.name===name);
    this.timers[id] = 0;
    this.update();
  }
  update=(time=0) =>{
    const updateHandler=(handler, id)=>{
      if(this.timers[id] - time < 0){
        this.timers[id] = handler.delay + time;
        handler.callback();
      }
    }
    this.handlers.forEach( updateHandler );
  }

}