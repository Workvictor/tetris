import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Wrapper, SimpleWindow, SimpleButton, ACTIONS, HSLA } from './index';

const CheckBox = styled.div`
  display: flex;
  position: relative;
  &:before{
    content: 'X';
    position: absolute;
    top: calc(50% - 13px);
    left: calc(50% - 9px);
    font-size: 42px;
    z-index: ${({checked})=>checked ? 1 : -1};
    pointer-events: none;
  }
`
const FlexRow = styled.div`
  display: flex;
  align-content: center;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`

export const OptionsApp = props => {
  const { stages, stage, setMusicVolume, toggleMusicMute, setStage, AudioController, preferences } = props;
  return (
  <Wrapper isVisible={stages.find(elem=>elem.id===stage).isActive}>
    <SimpleWindow 
      hsla={ HSLA(210) }
      width={'400px'}
    >    
      Options
      <FlexRow>
      Mute music
      <CheckBox checked={preferences.MUSIC_MUTE}>
        <SimpleButton 
          square
          inline
          hsla={ HSLA(210) }
          onClick={()=>{
            AudioController.playSoundByROLE('SFX_pick');
            toggleMusicMute()
            }
          }
        />
      </CheckBox>
      </FlexRow>
      <SimpleButton 
        hsla={ HSLA(210) }
        onClick={()=>{ 
          AudioController.playSoundByROLE('SFX_pick'); 
          setStage({id:'menu'})
          }
        }
      >
        Back
      </SimpleButton>
    </SimpleWindow>
  </Wrapper>
  )
};
export const Options = connect(
  state => ({
    stages: state.stages,
    AudioController: state.audioController,
    preferences: state.preferences,
  }),
  dispatch => ({
    setPreferences: data => dispatch(ACTIONS.setPreferences(data)),
    toggleMusicMute: () => dispatch(ACTIONS.toggleMusicMute()),
    setStage: data => dispatch(ACTIONS.setStage(data)),
    setMusicVolume: data => dispatch(ACTIONS.setMusicVolume(data)),
  })
)(OptionsApp);