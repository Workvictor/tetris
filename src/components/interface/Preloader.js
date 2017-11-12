export class Preloader {
  constructor(id = 'preloader') {
    this.preloader = document.getElementById(id);
  }
  hide = () => {
    this.preloader.classList.add('hide-animation');
    this.preloader.addEventListener('animationend', this.hidePreloader, false);
  };
  hidePreloader = () => {
    this.preloader.classList.remove('hide-animation');
    this.preloader.classList.add('visibility-hidden');
  };
  show = () => {
    this.preloader.classList.remove('visibility-hidden');
  };
}
