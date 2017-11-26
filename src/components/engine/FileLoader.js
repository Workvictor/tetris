import React from 'react';
import { connect } from 'react-redux';
import { Wrapper, ACTIONS } from './index';

class FileLoaderApp extends React.Component {
  
  componentDidMount=()=>{
    if(this.props.initOnStartup) {
      const { setStage, files } = this.props;
      const id = 'fileLoader';
      setStage({id});
      this.recursiveLoading(files);
    }
  }

  recursiveLoading=(fileList)=>{
    fileList.forEach((elem, index) => {
      this.loadFile(elem);
    });
  }

  loadFile(fileInfo) {

    const loadProgress=({ total, loaded })=> {
      const { updateFileInfo } = this.props;
      updateFileInfo({name: fileInfo.name, loaded, total});
    }

    const loadEnd=({target})=> {
      const { setStage, audioController, updateFileInfo, files } = this.props;
      updateFileInfo({name: fileInfo.name, ready:true});
      fileInfo.content === 'audio' &&
        audioController
          .decodeBuffer(target.response, fileInfo)
            .then( ()=>{
              updateFileInfo({name: fileInfo.name, decoded:true});
              this.onAllAudioLoaded(files) && setStage({id:'menu'})
            })
      
    }

    const request = new XMLHttpRequest();
    const filePath = `static/${fileInfo.content}/${fileInfo.name}`;
    request.open('GET', filePath, true);
    request.responseType = fileInfo.content === 'audio' ? 'arraybuffer' : '';
    request.addEventListener("progress", loadProgress);
    request.addEventListener("load", loadEnd);
    request.send();
  }

  get loaded(){
    return this.props.files.reduce((sum, elem)=>elem.loaded+sum, 0);
  }

  get total(){
    return this.props.files.reduce((sum, elem)=>elem.total+sum, 0);
  }

  get audioTotal(){
    return this.props.files.filter(elem=>elem.content==='audio').length;
  }
  
  get audioReady(){
    return this.props.files.filter(elem=>elem.decoded && elem.content==='audio').length;
  }

  onAllAudioLoaded=(files)=>
    files.filter(elem=>elem.ready && elem.content==='audio').length+1 === files.filter(elem=>elem.content==='audio').length 

  render(){
    const {  stages, stage, files } = this.props;
    const progress = this.loaded/this.total || 0;
    const progressAudio = this.audioReady/this.audioTotal || 0;
    return(
      <Wrapper isVisible={stages.find(elem=>elem.id===stage).isActive} >
        { progress !== 1 && `Loading resources... ${Math.floor(progress*100)}%` }
        { progress === 1 && `Decoding audio... ${Math.floor(progressAudio*100)}%` }
      </Wrapper>
    )
  }

}

export const FileLoader = connect(
  state => ({
    stages: state.stages,
    audioController: state.audioController,
    files: state.files,
  }),
  dispatch => ({
    setStage: data => dispatch(ACTIONS.setStage(data)),    
    updateFileInfo: data => dispatch(ACTIONS.updateFileInfo(data))
  })
)(FileLoaderApp);