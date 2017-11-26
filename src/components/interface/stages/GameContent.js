import React from 'react';
import { connect } from 'react-redux';
import { Wrapper, CanvasApi, GameInput, ActionFrame, HSLA, Display, DisplayBottomWidget, FigureGenerator, Grid } from './index';

export class GameContentApp extends React.Component {
  constructor() {
    super();
        
    let cellSize = 40;
    while (window.innerHeight-100 < 20*cellSize){
      cellSize -=5;
    }

    this.cellSize = cellSize;

    this.grid = new Grid({
      width: 10,
      height: 20,
      cellSize
    })


    this.figureGenerator = new FigureGenerator({
      cellSize: this.cellSize, 
      maxSize: 4
    });

    this.input = new GameInput({
      ArrowDown: this.arrowDown,
      ArrowUp: this.rotateCW,
      ArrowLeft: this.arrowLeft,
      ArrowRight: this.arrowRight,
      KeyZ: this.rotateCCW,
      KeyC: this.rotateCW,
      KeyX: this.dropShape,
    });

    this.RAF = new ActionFrame();


    // this.input.debugMode = true;
  }

  componentDidUpdate = () => {
    const { stages, stage } = this.props;

    const activate=()=>{
      // this.props.audioController.playTrackByROLE('MUSIC_gameTheme');
      this.input.activate();
      this.RAF.pause = false;
    }

    const deactivate=()=>{
      // this.props.audioController.stopActiveTrack();
      this.input.deactivate();
      this.RAF.pause = true;      
    }
    
    stages.find(elem => elem.id === stage).isActive
    ? activate()
    : deactivate();

  };

  dropShape=()=>{
    this.props.audioController.playSoundByROLE('SFX_move');

  }

  rotateCW=()=>{
    this.props.audioController.playSoundByROLE('SFX_move');
    this.figure.rotateCW();
  }

  rotateCCW=()=>{
    this.props.audioController.playSoundByROLE('SFX_move');
    this.figure.rotateCCW();
  }

  arrowDown=()=>{ 
    this.figure.moveY(+1)
    this.checkVerticalMove();
  }

  arrowLeft=()=>{
    this.props.audioController.playSoundByROLE('SFX_move');
    this.figure.moveX(-1);
  }

  arrowRight=()=>{
    this.props.audioController.playSoundByROLE('SFX_move');
    this.figure.moveX(+1);
  }

  checkVerticalMove=()=>((
     this.figure.isOutOfBoundsY(this.grid.data)
  || this.figure.isCollide(this.grid.data))
  && this.figureLanding())
  
  checkHorisontalMove =()=>((
     this.figure.isOutOfBoundsX(this.grid.data) 
  || this.figure.isCollide(this.grid.data)) 
  && this.figure.alignHorizontal(this.grid.data))

  figureLanding=()=>{
    this.props.audioController.playSoundByROLE('SFX_landing');

    this.figure.moveY(-1);
    
    this.grid.addShapeLanded(this.figure);

    this.displayBackground = this.canvas.compose.normal(this.background, this.grid.sprite);    

    this.figure.isOutOfStack()
    ? this.gameOver()
    : this.createNewFigure()
    
  }

  createNewFigure=()=>{
    this.figure = this.figureGenerator.shapes.randomFigure();
    this.figure.x = this.grid.randomX;
  }

  gameOver=()=>{
    this.input.deactivate();
    this.RAF.pause = true;
  }

  
  GAME_LOOP = (t) => {

    this.canvas.ctx.drawImage(this.displayBackground, 0,0);
    
    
    this.checkHorisontalMove();
    
    if(this.timer - t < 0){
      this.timer = t + 1000;
      this.figure.moveY(+1);
      this.checkVerticalMove();
    }

    
    this.canvas.ctx.drawImage(this.figure.sprite, this.figure.x*this.cellSize, this.figure.y*this.cellSize);

    
    // this.grid.data.forEach((row, y)=>
    //   row.forEach((elem, x)=>{
    //     this.canvas.ctx.fillStyle = elem===1 ? HSLA(360,80,60).css : elem===-1 ? HSLA(0,0,0).css : HSLA(0,100,100).css;
    //     this.canvas.ctx.fillText(elem, Math.floor(x*this.cellSize+this.cellSize/2), Math.floor(y*this.cellSize+this.cellSize/2), this.cellSize)
    //   }))
  };

  componentDidMount = () => {
    this.canvas = new CanvasApi({
      HTML_canvas: this.refs.canvas, 
      aspectRatio: 10/20, 
      width: this.cellSize * 10,
      cellSize: this.cellSize
    });
    this.canvas.ctx.fillStyle = HSLA(0,100,100).css;
    this.canvas.ctx.font = '14px Arial, serif';
    this.canvas.ctx.textAlign = "center";
    this.canvas.ctx.textBaseline = "middle";

    this.timer = 0;
    
    this.pattern = this.canvas.draw.grid({
      strokeStyle: HSLA(130, 30, 75).css,
      shadowColor: HSLA(130, 30, 85).css,
      globalAlpha: 0.2
    });

    this.background = this.canvas.draw.rect({
      background: HSLA(130, 20).css
    });

    this.displayBackground = this.canvas.compose.overlay(this.background, this.pattern);

    this.figure = this.figureGenerator.shapes.randomFigure();
    this.figure.x = this.grid.randomX;
    
    this.RAF.init(this.GAME_LOOP);
    this.RAF.pause = true;
  };

  render() {
    const { stages, stage } = this.props;
    return (
      <Wrapper 
        pause={this.RAF.pause}
        isVisible={stages.find(elem => elem.id === stage).isActive}
      >
        <Display>
          <canvas ref="canvas" />
        </Display>
        <DisplayBottomWidget>
          SCORE
        </DisplayBottomWidget>
      </Wrapper>
    );
  }
}

export const GameContent = connect(state => ({
  stages: state.stages,
  audioController: state.audioController,
}))(GameContentApp);
