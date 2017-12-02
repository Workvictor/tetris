import React from 'react';
import { connect } from 'react-redux';
import {
  Wrapper,
  CanvasApi,
  GameInput,
  ActionFrame,
  HSLA,
  ACTIONS,
  Display,
  DisplayBottomWidget,
  DisplayWidget,
  WidgetText,
  FigureGenerator,
  Grid,
  Game,
  Timer
} from './index';

export class GameContentApp extends React.Component {
  constructor(props) {
    super();

    this.game = new Game({
      dropDelay: 1500,
      showScore: 0
    });
  }

  componentDidUpdate = () => {
    const { stages, stage } = this.props;

    stages.find(elem => elem.id === stage).isActive
      ? this.game.pause(false)
      : this.game.pause(true);
  };

  componentDidMount = () => {
    this.game.canvas.HTML_canvas = this.refs.canvas;
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
          <WidgetText animate={game.scoreStack.length > 0}>
            {game.showScore}
          </WidgetText>
        </DisplayWidget>
      </Wrapper>
    );
  }
}

export const GameContent = connect(state => ({
  stages: state.stages,
  audioController: state.audioController,
  game: state.game
}))(GameContentApp);
