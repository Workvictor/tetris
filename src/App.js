import React from 'react';
import {
  Wrapper, 
  Options, 
  GameInput,
  Interface
} from './components'

const { Preloader, MainMenu } = Interface;

export class App extends React.Component {

  constructor(){
    super();
    this.state={
      menu: false,
      game: true,
      options: false,
    }
    console.log('--- "Super SECRET AREA" achievement unlocked!!! ---')
  }

  pause=()=>{
    this.setState({
      menu: true,
      game: false,
    })
  }

  resume=()=>{
    this.setState({
      menu: false,
      game: true,
    })
  }

  onEscPressed=(key)=>{
    key === 27 && this.state.menu
    ? this.resume()
    : this.pause()
  }

  componentDidMount=()=>{
    this.input = new GameInput();
    this.input.keyDownHandler = this.onEscPressed;
    this.preloader = new Preloader();
    this.preloader.hide();
  }
  
  render() {
    return (
      <Wrapper isVisible={true}>
      <Wrapper isVisible={this.state.game}>
        game content
      </Wrapper>
        <MainMenu isVisible={this.state.menu}/>
      </Wrapper>
    );
  }
}