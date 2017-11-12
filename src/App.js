import React from 'react';
import { GameInput, Interface } from './components';

const { Preloader, MainMenu, ConfirmExit, GameContent, Options , Wrapper} = Interface;

export class App extends React.Component {
  constructor() {
    super();
    this.state = {
      menu: false,
      game: false,
      options: false,
      exit: false,
    };
    console.log('--- "Super SECRET AREA" achievement unlocked!!! ---');
  }

  showOptions = () => {
    this.setState({
      options: true,
      menu: false,
      game: false,
      exit: false,
    });
  };

  showMenu = () => {
    this.setState({
      menu: true,
      options: false,
      game: false,
      exit: false,
    });
  };

  showGame = () => {
    this.setState({
      game: true,
      menu: false,
      options: false,
      exit: false,
    });
  };

  showExit = () => {
    this.setState({
      exit: true,
      game: false,
      menu: false,
      options: false,
    });
  };

  onEscPressed = key => {
    key === 27 && this.state.menu ? this.showGame() : this.showMenu();
  };

  componentDidMount = () => {
    this.input = new GameInput();
    this.input.keyDownHandler = this.onEscPressed;
    this.preloader = new Preloader();
    this.preloader.hide(this.showMenu);
  };

  render() {
    return (
      <Wrapper isVisible={true}>
        <MainMenu 
          exit={this.showExit}
          game={this.showGame}
          menu={this.showMenu}
          options={this.showOptions}
          isVisible={this.state.menu} 
        />
        <Options isVisible={this.state.options}/>
        <ConfirmExit isVisible={this.state.exit}/>
        <GameContent isVisible={this.state.game}/>
      </Wrapper>
    );
  }
}
