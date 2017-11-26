import React from 'react';
import { connect } from 'react-redux';
import { MenuButton } from './MenuButton';
import { Wrapper, SimpleWindow, ACTIONS, HSLA, GameInput, } from './index';

class MainMenuApp extends React.Component{

  constructor(){
    super();
    this.input = new GameInput({
      Enter: this.navigateMenuEnter,
      ArrowDown: this.navigateMenuDown,
      ArrowUp: this.navigateMenuUp,     
    });
  }

  navigateMenu=(dir)=>{
    const { menu, selectMenuID } = this.props;
    const { items, selected } = menu;
    const getBounds=(dir, items)=>dir < 0 ? 0 : items.length-1;
    const getMethod=(dir)=>dir > 0 ? 'min' : 'max';
    selectMenuID(items[Math[getMethod(dir)](getBounds(dir, items), items.findIndex(elem=>elem.id===selected)+dir)])
  }

  navigateMenuDown=()=>this.navigateMenu(+1);
  
  navigateMenuUp=()=>this.navigateMenu(-1);

  navigateMenuEnter=()=>{
    const { menu, clickMenuID } = this.props;
    const { items, selected } = menu;
    clickMenuID(items[items.findIndex(elem=>elem.id===selected)]);    
  }

  componentDidUpdate=()=>{
    const { stages, stage } = this.props;
    stages.find(elem=>elem.id===stage).isActive 
    ? this.input.activate()
    : this.input.deactivate();

  // const { stages, stage, audioController } = this.props;
  
  //     const activate=()=>{
  //       audioController.playTrackByROLE('MUSIC_title');
  //       this.input.activate();
  //     }
  
  //     const deactivate=()=>{
  //       audioController.stopActiveTrack();
  //       this.input.deactivate();    
  //     }
      
  //     stages.find(elem => elem.id === stage).isActive
  //     ? activate()
  //     : deactivate();
  }

  render(){
    const { stages, menu, stage } = this.props;
    return (
      <Wrapper isVisible={stages.find(elem=>elem.id===stage).isActive}>
        <SimpleWindow
          hsla={ HSLA(210) }
          width={'200px'}
        >
          Main Menu
          {menu.items.filter(elem=>!elem.tags || !elem.tags.includes('onPause')).map(({title, id, role}, index) => (
            <MenuButton
              key={index}              
              id={id}
              title={title}
              role={role}
            />
          ))}
        </SimpleWindow>
      </Wrapper>
    );
  }
};

export const MainMenu = connect(
  state => ({
    stages: state.stages,
    audioController: state.audioController,
    menu: state.menu,
  }),
  dispatch => ({
    setStage: data => dispatch(ACTIONS.setStage(data)),
    setAudioController: data => dispatch(ACTIONS.setAudioController(data)),
    selectMenuID: data => dispatch(ACTIONS.selectMenuID(data)),
    resetMenuSelection: data => dispatch(ACTIONS.resetMenuSelection(data)),
    clickMenuID: data => dispatch(ACTIONS.clickMenuID(data)),
  })
)(MainMenuApp);
