import { keyMirror } from './keyMirror';

export const ACTIONS = {
  setStage: payload => dispatch => dispatch({ type: TYPES.SET_STAGE, payload }),
  setOption: payload => dispatch => dispatch({ type: TYPES.SET_OPTION, payload }),
  setAudioController: payload => dispatch => dispatch({ type: TYPES.SET_AUDIO_CONTROLLER, payload }),
  updateFileInfo: payload => dispatch => dispatch({ type: TYPES.UPDATE_FILE_INFO, payload }),
  setMusicVolume: payload => dispatch => dispatch({ type: TYPES.SET_MUSIC_VOLUME, payload }),
  toggleMusicMute: () => (dispatch, state) => {
    state().audioController.toggleMuteMusic();
    return dispatch({ type: TYPES.SET_PREFERENCES, payload: { MUSIC_MUTE: !state().preferences.MUSIC_MUTE} })
  },
  setPreferences: payload => dispatch => dispatch({ type: TYPES.SET_PREFERENCES, payload }),

  selectMenuID: payload => (dispatch, state) => {
    state().audioController.playSoundByROLE('SFX_hover');
    return dispatch({ type: TYPES.SELECT_MENU_ID, payload });
  },
  resetMenuSelection: () => dispatch => dispatch({ type: TYPES.RESET_MENU_SELECTION }),
  clickMenuID: payload => (dispatch, state) => {
    state().audioController.stopActiveTrack();
    state().audioController.playTrackByROLE(payload.role);
    state().audioController.playSoundByROLE('SFX_pick');
    return dispatch({ type: TYPES.SET_STAGE, payload });
  },
};

export const TYPES = keyMirror({
  SET_STAGE: null,
  SET_OPTION: null,
  SET_AUDIO_CONTROLLER: null,
  UPDATE_FILE_INFO: null,
  SET_MUSIC_VOLUME: null,
  TOGGLE_MUSIC_MUTE: null,
  SET_PREFERENCES: null,

  SELECT_MENU_ID: null,
  RESET_MENU_SELECTION: null,
  CLICK_MENU_ID: null,

});
