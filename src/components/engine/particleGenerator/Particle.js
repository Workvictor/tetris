import { HSLA, CanvasApi } from './index';
export class Particle {
  constructor({
    x = 0,
    y = 0,
    width = 4,
    height = 4,
    velocityX,
    velocityY,
    directionX,
    directionY = 1,
    sprite
  }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.direction = {
      x: directionX || this.randomizeDirection(),
      y: directionY
    };
    this.velocity = {
      x: velocityX || this.randomizeVelocity(),
      y: velocityY || -this.randomizeVelocity()*2
    };
    this.canvas = new CanvasApi({
      width: this.width,
      aspectRatio: this.width / this.height
    });
    this.sprite =
      sprite ||
      this.canvas.draw.rect({
        width: this.width,
        height: this.height,
        background: HSLA(300, 100, 100).css
      });
  }

  update = () => {
    this.velocity.y += 0.1;
    this.x += this.velocity.x * this.direction.x;
    this.y += this.velocity.y;
  };

  randomizeDirection = () => (Math.random() > 0.5 ? 1 : -1);

  randomizeVelocity = (min=1, max=2) => min+Math.random()*(max-min);
}
