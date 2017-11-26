export class Preloader {
  constructor(id = 'preloader') {
    this.hideCallback = null;
    this.preloader = document.getElementById(id);
    this.show();
  }
  hide = () => new Promise((resolve, reject) => {
      this.preloader.classList.add('hide-animation');
      this.preloader.addEventListener('animationend', ()=>{
        this.hidePreloader();
        resolve();
      }, false);
    });
  hidePreloader = () => {
    this.preloader.classList.remove('hide-animation');
    this.preloader.classList.add('visibility-hidden');
  };
  show = () => {
    this.preloader.classList.remove('visibility-hidden');
  };
}
