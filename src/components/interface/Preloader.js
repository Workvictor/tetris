export class Preloader {
  constructor(id = 'preloader') {
    this.hideCallback = null;
    this.preloader = document.getElementById(id);
    this.show();
  }
  hide = (callback) => {
    this.hideCallback = callback;
    this.preloader.classList.add('hide-animation');
    this.preloader.addEventListener('animationend', this.hidePreloader, false);
  };
  hidePreloader = () => {
    this.preloader.classList.remove('hide-animation');
    this.preloader.classList.add('visibility-hidden');
    this.hideCallback && this.hideCallback();
  };
  show = () => {
    this.preloader.classList.remove('visibility-hidden');
  };
}
