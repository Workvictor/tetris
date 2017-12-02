import React from 'react';
import { connect } from 'react-redux';
import { Wrapper,
  CanvasApi,
  GameInput,
  ActionFrame,
  HSLA,
  ACTIONS,
  Display,
  DisplayBottomWidget, DisplayWidget, WidgetText,
  FigureGenerator,
  Grid,
  Game,
  Timer
} from './index';

export class GameContentApp extends React.Component {
  constructor(props) {
    super();
    this.state={
      scoreAnimate: false,
      gameScore: props.game.score,
      scoreIncrementStack: [],
    }
    this.scoreAnimate = false;
    this.animateDuration = 300;
    this.incrementSpeed = 30;
    this.gameScore = props.game.score;
    this.scoreIncrementStack = [];

    this.game = new Game({
      dropDelay: 1500,
      showScore: 0,
    });

    let cellSize = 40;
    while (window.innerHeight-100 < 20 * cellSize){
      cellSize -=4;
    }

    this.cellSize = cellSize;
    this.gridOffset = 4;

    this.grid = new Grid({
      offset: 4,
      width: 10,
      height: 20,
      cellSize: this.cellSize,
    });

    this.figureGenerator = new FigureGenerator({
      cellSize: this.cellSize,
      maxSize: 4,
      grid: this.grid
    });

    this.input = new GameInput({
      ArrowDown: this.moveDown,
      ArrowLeft: this.moveHandler,
      ArrowRight: this.moveHandler,
      ArrowUp: this.rotateHandler,
      KeyQ: this.rotateHandler,
      KeyE: this.rotateHandler,
      KeyX: this.dropShape,
      F1: this.DEBUG_DropLine,
      F2: this.DEBUG_DropLineX2,
      F3: this.DEBUG_DropLineX3,
      F4: this.DEBUG_DropLineX4,
    });

    this.RAF = new ActionFrame();

    props.resetGame();

    this.timer= new Timer({
      handlers:[
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
    })

  }

  DEBUG_DropLine=()=>{
    this.grid.linesStack = [0];
  }
  DEBUG_DropLineX2=()=>{
    this.grid.linesStack = [0,1];
  }
  DEBUG_DropLineX3=()=>{
    this.grid.linesStack = [0,1,2];
  }
  DEBUG_DropLineX4=()=>{
    this.grid.linesStack = [0,1,2,3];
  }

  componentDidUpdate = () => {
    const { stages, stage } = this.props;

    const activate=()=>{
      this.input.activate();
      this.RAF.pause = false;
    }

    const deactivate=()=>{
      this.input.deactivate();
      this.RAF.pause = true;
    }

    stages.find(elem => elem.id === stage).isActive
    ? activate()
    : deactivate();

  };

  moveSFX=()=>{
    this.props.audioController.playSoundByROLE('SFX_move');
  }

  moveDown=()=>{
    this.moveSFX();
    this.timer.reset('manualDrop');
  }

  manualDrop=()=>{
    this.input.vector.y > 0 && this.dropHandler();
  }

  dropHandler=()=>{
    this.figure.moveY(+1);
    this.figure.collide() && this.figureLanding();
  }

  dropShape=()=>{
    this.moveSFX();
    // TODO: add instant drop function
  }

  moveHandler=()=>{
    this.moveSFX();
    this.timer.reset('moveX');
  }

  moveX=()=>{
    this.input.vector.x && this.figure.moveX(this.input.vector.x);
  }

  rotateHandler=()=>{
    this.moveSFX();
    this.timer.reset('rotate');
  }

  rotate=()=>{
    this.input.rotation.direction && this.figure.rotate(this.input.rotation.direction);
  }

  scoreAnimation=()=>{
    const { game, updateShowScore } = this.props;
    game.scoreStack.length > 0 &&
    updateShowScore({
      showScore: game.showScore + game.scoreStack[0]
    });
  }

  figureLanding=()=>{
    this.props.audioController.playSoundByROLE('SFX_landing');

    this.figure.moveY(-1);

    this.grid.addShapeLanded(this.figure);

    this.displayBackground = this.canvas.compose.overlay(this.background, this.pattern);
    this.displayBackground = this.canvas.compose.normal(this.displayBackground, this.grid.sprite, 0, -this.grid.offset*this.cellSize);


    this.figure.isOutOfStack()
    ? this.gameOver()
    : this.createNewFigure()

  }

  createNewFigure=()=>{
    this.figure = this.figureGenerator.shapes.randomFigure();
    this.figure.x = this.grid.randomX(this.figure);
  }

  gameOver=()=>{

    this.props.pauseGame();

    this.props.audioController.playSoundByROLE('SFX_gameOver');

    this.displayBackground = this.canvas.compose.overlay(this.background, this.pattern);
    this.createNewFigure();

    this.grid.reset();

    this.props.setStage({id:'menu'});
    this.RAF.pause = true;
    this.input.reset();

    this.props.resetGame();

  }


  GAME_LOOP = (t) => {
    this.canvas.ctx.drawImage(this.displayBackground, 0,0);

    this.timer.update(t);

    this.canvas.ctx.drawImage(this.figure.sprite, this.figure.x*this.cellSize, (this.figure.y-this.grid.offset)*this.cellSize);

  };

  componentDidMount = () => {
    this.canvas = new CanvasApi({
      aspectRatio: 10/20,
      width: this.cellSize * 10,
      cellSize: this.cellSize
    });
    this.canvas.ctxSetup({
      fillStyle: HSLA(0,100,100).css,
      font: '16px Arial, serif',
      textAlign: "center",
      textBaseline: "middle",
    });
    console.log(this.canvas.ctx)
    this.canvas.HTML_canvas = this.refs.canvas;

    console.log(this.canvas.ctx)

    this.pattern = this.canvas.draw.grid({
      strokeStyle: HSLA(130, 30, 75).css,
      shadowColor: HSLA(130, 30, 85).css,
      globalAlpha: 0.2
    });

    this.background = this.canvas.draw.rect({
      background: HSLA(130, 20).css
    });

    this.displayBackground = this.canvas.compose.overlay(this.background, this.pattern);

    this.createNewFigure();

    this.RAF.init(this.GAME_LOOP);
    this.RAF.pause = true;
  };


  render() {
    const { stages, stage, game } = this.props;
    return (
      <Wrapper
        pause={game.pause}
        isVisible={stages.find(elem => elem.id === stage).isActive}
      >
        <Display>
          <canvas ref="canvas" />
        </Display>
        <DisplayWidget>
        <WidgetText animate={ game.scoreStack.length > 0 }>
          {game.showScore}
        </WidgetText>
        </DisplayWidget>
      </Wrapper>
    );
  }
}

export const GameContent = connect(
  state => ({
    stages: state.stages,
    audioController: state.audioController,
    game: state.game,
  }),
  dispatch => ({
    setStage: data => dispatch(ACTIONS.setStage(data)),
    updateShowScore: data => dispatch(ACTIONS.updateShowScore(data)),
    pauseGame: () => dispatch(ACTIONS.setStage({pause: true})),
    unPauseGame: () => dispatch(ACTIONS.setStage({pause: false})),
    resetGame: () => dispatch(ACTIONS.updateGame({
      score: 0,
      showScore: 0,
      scoreStack: [],
      lineScore: 10,
      linesCount: 0,
      spreeTimeout: 1000,
      incrementCount: 10,
      incrementDelay: 30,
      lineMultiplier: 1.2,
      dropDelay: 1000,
    })),
  })
)(GameContentApp);
