import React from 'react';
import { connect } from 'react-redux';
import { GameInput, STAGES, INTERFACE, ACTIONS, AudioController, FileLoader } from './components';

const { Preloader, Wrapper, GameTitle } = INTERFACE;
const { MainMenu, ConfirmExit, GameContent, Options } = STAGES;

class MainApp extends React.Component {
  constructor() {
    super();
    console.log('--- "Super SECRET AREA" achievement unlocked!!! ---');
    this.input = new GameInput({    
      Escape: this.toggleMenu,      
    });
    this.input.activate();
  }

  toggleMenu=()=>{
    const { stages, setStage } = this.props;
    const id = stages.find(elem=>elem.isActive===true).id === 'menu' ? 'game' : 'menu';
    setStage({id});
    this.props.audioController.playSoundByROLE('SFX_pick');
  }

  componentDidMount = () => {

    this.props.setAudioController(new AudioController(this.props));

   

    this.preloader = new Preloader();
    this.preloader.hide();

  };

  componentDidUpdate=(nextProps)=>{
    const { audioController } = this.props;
    audioController.updatePreferences(nextProps);
  }

  render() {
    return (
      <Wrapper isVisible>
        <GameTitle stage='menu' />
        <MainMenu stage='menu' />
        <Options stage='options' />
        <ConfirmExit stage='exit' />
        <GameContent stage='game' />
        <FileLoader initOnStartup stage='fileLoader' />
      </Wrapper>
    );
  }
}

export const App = connect(
  state => ({
    files: state.files,
    stages: state.stages,
    options: state.options,
    audioController: state.audioController,
    preferences: state.preferences,
    menu: state.menu,
  }),
  dispatch => ({
    setStage: data => dispatch(ACTIONS.setStage(data)),
    setAudioController: data => dispatch(ACTIONS.setAudioController(data)),
    selectMenuID: data => dispatch(ACTIONS.selectMenuID(data)),
    resetMenuSelection: data => dispatch(ACTIONS.resetMenuSelection(data)),
    clickMenuID: data => dispatch(ACTIONS.clickMenuID(data)),
  })
)(MainApp);