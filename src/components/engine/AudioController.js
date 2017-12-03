export class AudioController{
  constructor({files, preferences}){
    this.preferences = preferences;
    const audioFiles = files.filter(elem=>elem.content==='audio');
    this.decodeCountMax = audioFiles.length;
    this.decodeProgress = 0;
    this.decodeCount = 0;

    this.CTX = new(window.AudioContext || window.webkitAudioContext)();
    this.MUSIC_OUTPUT = this.CTX.createBufferSource();
    this.MUSIC_GAIN = this.CTX.createGain();
    this.MUSIC_GAIN.gain.value = 0.25;

    this.SFX_GAIN = this.CTX.createGain();
    this.SFX_GAIN.gain.value = 1;

    this.MUSIC_MUTE = false;
    this.MUSIC_VOLUME = this.MUSIC_GAIN.gain.value;

    this.activeTrack = null;

    this.TRACKS = [...audioFiles];
  }

  updatePreferences=({preferences})=>{
    this.preferences = preferences;
  }

  addTrack=(buffer, info)=>{
    const MUSIC_OUTPUT = this.CTX.createBufferSource();
    MUSIC_OUTPUT.buffer = buffer;
    if(info.tag === 'music') {
      MUSIC_OUTPUT.start();
      MUSIC_OUTPUT.loop = true
    }

    this.TRACKS = [
      ...this.TRACKS.slice(0, this.TRACKS.findIndex(elem=>elem.name===info.name)),
      { ...info, output:MUSIC_OUTPUT },
      ...this.TRACKS.slice(this.TRACKS.findIndex(elem=>elem.name===info.name)+1)
    ];
    this.decodeCount += 1;
    this.decodeProgress = this.decodeCount/this.decodeCountMax;
    this.decodeProgress === 1 && this.playTrackByROLE('MUSIC_title')
  }

  decodeBuffer=(data, info)=> this.CTX.decodeAudioData(data).then(buffer=> this.addTrack(buffer, info));

  stopActiveTrack=()=>{
    this.activeTrack &&
    this.TRACKS.find(elem=>elem.name===this.activeTrack.name).output.disconnect(this.MUSIC_GAIN)
  }

  playTrackByROLE=(role)=>{
    const roleTracks = this.TRACKS.filter(elem=>elem.role===role);
    this.activeTrack = roleTracks[Math.floor(Math.random()*roleTracks.length)];

    this.TRACKS.find(elem=>elem.name===this.activeTrack.name).output.loop = true
    this.TRACKS.find(elem=>elem.name===this.activeTrack.name).output.connect(this.MUSIC_GAIN);

    this.MUSIC_GAIN.connect(this.CTX.destination);
  }

  playSoundByROLE=(role)=>{
    const SFX_OUTPUT = this.CTX.createBufferSource();
    SFX_OUTPUT.buffer = this.TRACKS.find(elem=>elem.role===role).output.buffer;
    SFX_OUTPUT.loop = false;
    SFX_OUTPUT.start(0);
    SFX_OUTPUT.connect(this.SFX_GAIN);
    this.SFX_GAIN.connect(this.CTX.destination);
  }

  toggleMuteMusic=()=>{
      this.MUSIC_GAIN.gain.value > 0
    ? this.muteMusic()
    : this.unMuteMusic()
  }

  unMuteMusic=()=>{
    this.MUSIC_GAIN.gain.value = this.MUSIC_VOLUME;
  }

  muteMusic=()=>{
    this.MUSIC_VOLUME = this.MUSIC_GAIN.gain.value;
    this.MUSIC_GAIN.gain.value = 0;
  }

}