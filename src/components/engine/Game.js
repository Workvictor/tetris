import {
  HSLA,
  STORE,
  ACTIONS,
  Grid,
  Timer,
  CanvasApi,
  GameInput,
  ActionFrame,
  FigureGenerator,
  ParticleGenerator
} from './index';

export class Game {
  constructor(props = {}) {
    this.data = {
      ...this.DEFAULTS,
      ...props
    };

    this.canvas = new CanvasApi({
      aspectRatio: 10 / 20,
      width: this.cellSize * 10,
      cellSize: this.cellSize
    });

    this.particleGenerator = new ParticleGenerator({
      width: this.canvas.width,
      height: this.canvas.height,
    });

    this.grid = new Grid({
      offset: 4,
      width: 10,
      height: 20,
      cellSize: this.cellSize
    });

    this.figureGenerator = new FigureGenerator({
      cellSize: this.cellSize,
      maxSize: 4,
      grid: this.grid
    });

    this.createNewFigure();

    this.pattern = this.canvas.draw.grid({
      strokeStyle: HSLA(130, 30, 75).css,
      shadowColor: HSLA(130, 30, 85).css,
      globalAlpha: 0.2
    });

    this.background = this.canvas.draw.rect({
      background: HSLA(130, 20).css
    });

    this.displayBackground = this.canvas.compose.overlay(
      this.background,
      this.pattern
    );

    this.input = new GameInput({
      ArrowDown: this.moveDown,
      ArrowLeft: this.moveHandler,
      ArrowRight: this.moveHandler,
      ArrowUp: this.rotateHandler,
      KeyQ: this.rotateHandler,
      KeyE: this.rotateHandler,
      KeyX: this.dropShape
    });

    this.RAF = new ActionFrame();


    this.timer = new Timer({
      handlers: [
        {
          name: 'dropHandler',
          delay: 1500,
          callback: this.dropHandler
        },
        {
          name: 'manualDrop',
          delay: 100,
          callback: this.manualDrop
        },
        {
          name: 'moveX',
          delay: 100,
          callback: this.moveX
        },
        {
          name: 'rotate',
          delay: 250,
          callback: this.rotate
        },
        {
          name: 'scoreAnimation',
          delay: 30,
          callback: this.scoreAnimation
        }
      ]
    });

    this.RAF.init(this.GAME_LOOP);
    this.RAF.pause = true;

    STORE.dispatch(ACTIONS.updateGame({ ...this.data }));
    this.reset();

  }

  get cellSize() {
    while (window.innerHeight - 100 < 20 * this.STATE.game.cellSize) {
      const cellSize = this.STATE.game.cellSize - 8;
      STORE.dispatch(ACTIONS.updateGame({ cellSize }));
    }
    return this.STATE.game.cellSize;
  }

  get DEFAULTS() {
    return {
      score: 0,
      showScore: 0,
      scoreStack: [],
      lineScore: 10,
      linesCount: 0,
      dropDelay: 1000,
      spreeTimeout: 1000,
      incrementCount: 10,
      incrementDelay: 30,
      lineMultiplier: 1.2
    };
  }

  get AUDIO() {
    return this.STATE && this.STATE.audioController;
  }

  get STATE() {
    return STORE.getState();
  }

  pause=(state=true)=>{
    const activate=()=>{
      this.input.activate();
      this.RAF.pause = false;
    }

    const deactivate=()=>{
      this.input.deactivate();
      this.RAF.pause = true;
    }
    state ? deactivate() : activate()
  }

  reset = () => STORE.dispatch(ACTIONS.updateGame({ ...this.data }));

  moveSFX = () => this.AUDIO.playSoundByROLE('SFX_move');

  moveDown = () => {
    this.moveSFX();
    this.timer.reset('manualDrop');
  };

  manualDrop = () => this.input.vector.y > 0 && this.dropHandler();

  dropHandler = () => {
    this.figure.collide(0,+1)
    ? this.figureLanding()
    : this.figure.moveY(+1)
  };

  dropShape = () => {
    this.moveSFX();
    // TODO: add instant drop function
  };

  moveHandler = () => {
    this.moveSFX();
    this.timer.reset('moveX');
  };

  moveX = () => this.input.vector.x && this.figure.moveX(this.input.vector.x);

  rotateHandler = () => {
    this.moveSFX();
    this.timer.reset('rotate');
  };

  rotate = () => this.input.rotation.direction && this.figure.rotate(this.input.rotation.direction);

  scoreAnimation = () => {
    const { game } = this.STATE;
    game.scoreStack.length > 0 &&
    STORE.dispatch(ACTIONS.updateShowScore({
      showScore: game.showScore + game.scoreStack[0]
    }));
  };

  figureLanding = () => {
    this.AUDIO.playSoundByROLE('SFX_landing');

    this.grid.addShapeLanded(this.figure);

    this.displayBackground = this.canvas.compose.overlay(
      this.background,
      this.pattern
    );
    this.displayBackground = this.canvas.compose.normal(
      this.displayBackground,
      this.grid.sprite,
      0,
      -this.grid.offset * this.cellSize
    );

    const coords = this.figure.getCollisionCoordinates();
    coords.x.forEach((elem,id)=>{
      this.particleGenerator.create.emitter({
        width: this.cellSize,
        x: elem * this.cellSize,
        y: (coords.y[id]-this.grid.offset+1) * this.cellSize
      })
    })

    this.canvas.ctx.drawImage(this.displayBackground, 0, 0);

    this.figure.isOutOfStack() ? this.gameOver() : this.createNewFigure();
  };

  createNewFigure = () => {
    this.figure = this.figureGenerator.shapes.randomFigure();
    this.figure.x = this.grid.randomX(this.figure);
  };

  gameOver = () => {
    this.pause();

    this.AUDIO.playSoundByROLE('SFX_gameOver');

    this.displayBackground = this.canvas.compose.overlay(
      this.background,
      this.pattern
    );
    this.createNewFigure();

    this.grid.reset();

    STORE.dispatch(ACTIONS.setStage({ id: 'menu' }));

    this.RAF.pause = true;
    this.input.reset();

    this.reset();
  };

  GAME_LOOP = t => {

    this.particleGenerator.update();

    this.canvas.ctx.drawImage(this.displayBackground, 0, 0);

    this.timer.update(t);

    this.canvas.ctx.drawImage(
      this.figure.sprite,
      this.figure.x * this.cellSize,
      (this.figure.y - this.grid.offset) * this.cellSize
    );

    this.particleGenerator.output && this.canvas.ctx.drawImage(this.particleGenerator.output, 0, 0);

  };
}
