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
    this.props.audioController.playSoundByROLE('SFX_move');
    if(this.figure.y + this.figure.sprite.height >= this.canvas.height) {
      this.canvas.ctx.drawImage(this.figure.sprite, this.figure.x, this.canvas.height - this.figure.sprite.height);
      this.displayBackground = this.canvas.compose.normal(this.background, this.canvas.self);

      this.figure = this.figureGenerator.shapes.randomFigure();
      this.figure.x = Math.floor(Math.random()*(this.canvas.width - this.figure.width + this.cellSize)/this.cellSize)*this.cellSize
      // this.figure.y = -Math.floor(this.figure.height); 

      this.props.audioController.playSoundByROLE('SFX_landing');
    }else{
      this.figure.y += this.cellSize;
      this.figure.y >=0 && this.grid.addShape(this.figure)        
    }
  }

  arrowLeft=()=>{
    this.props.audioController.playSoundByROLE('SFX_move');

    !this.grid.isShapeCollide(this.figure) && this.figure.x--

    // const offset = this.figure.x - this.cellSize;
    // this.figure.x = offset > 0 ? offset : 0;
  }

  arrowRight=()=>{
    this.props.audioController.playSoundByROLE('SFX_move');
    const offset = this.figure.x + 1;
    this.figure.x = offset < this.canvas.width - this.figure.sprite.width - this.cellSize 
    ? offset 
    : this.canvas.width - this.figure.sprite.width;
  }

  GAME_LOOP = (t) => {

    const figureLanding=(figure)=>{
      this.canvas.ctx.drawImage(this.figure.sprite, this.figure.x**this.cellSize, this.canvas.height - this.figure.sprite.height);
      this.displayBackground = this.canvas.compose.normal(this.background, this.canvas.self);
      
      this.grid.addShapeLanded(this.figure)

      this.figure = this.figureGenerator.shapes.randomFigure();
      this.figure.x = this.grid.randomX;
      
      this.props.audioController.playSoundByROLE('SFX_landing');
    }

    this.canvas.ctx.drawImage(this.displayBackground, 0,0);
    
    
    if(this.timer - t < 0){      
      this.timer = t + 1000;

      // this.figure.y ++;
      // this.grid.isShapeCollide(this.figure.moveY(+1)) 
      // ? figureLanding(this.figure.moveY(-1))
      // : this.grid.addShape(this.figure)

      // if(this.figure.y*this.cellSize + this.figure.sprite.height >= this.canvas.height - this.cellSize ) {

      //   this.canvas.ctx.drawImage(this.figure.sprite, this.figure.x**this.cellSize, this.canvas.height - this.figure.sprite.height);
      //   this.displayBackground = this.canvas.compose.normal(this.background, this.canvas.self);
        
      //   this.grid.addShapeLanded(this.figure)

      //   this.figure = this.figureGenerator.shapes.randomFigure();
      //   this.figure.x = this.grid.randomX;
        
      //   this.props.audioController.playSoundByROLE('SFX_landing');
      // }else{
      //   this.figure.y += 1;
      // }
      // this.figure.y >=0 && this.grid.addShape(this.figure)

    }
    
    this.canvas.ctx.drawImage(this.figure.sprite, this.figure.x*this.cellSize, this.figure.y*this.cellSize);

    
    this.grid.data.forEach((row, y)=>
      row.forEach((elem, x)=>{
        this.canvas.ctx.fillStyle = elem===1 ? HSLA(360,80,60).css : elem===-1 ? HSLA(0,0,50).css : HSLA(0,100,100).css;
        this.canvas.ctx.fillText(elem, x*this.cellSize, y*this.cellSize)
      }))
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
    this.canvas.ctx.textAlign = "left";
    this.canvas.ctx.textBaseline = "top";

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

    this.figures = this.figureGenerator.shapes.figures;
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
