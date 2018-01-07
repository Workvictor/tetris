import { HSLA, CanvasApi, STORE, ACTIONS } from './index';
import { Particle } from './Particle';
export class ParticleGenerator {
  constructor({ width = 100, height = 100 }) {
    this.settings = {
      particle: {
        width: 4,
        height: 4
      },
      emitter:{
        width: 10
      }
    };
    this.particles = [];
    this.width = width;
    this.height = height;
    this.canvas = new CanvasApi({
      width: this.width,
      aspectRatio: this.width / this.height
    });
    this.output = null;
  }
  get create() {
      const particle = ({
        x = 0,
        y = 0,
        width = this.settings.particle.width,
        height = this.settings.particle.height,
        hsla = HSLA(Math.floor(360/10), 65).css
      }) => {
        this.particles = [
          ...this.particles.slice(),
          new Particle({
            x,
            y,
            width,
            height,
            hsla
          })
        ];
      };

      const emitter = ({count=Math.floor(Math.random()*6+3), x, y, width=40}) => {
        const randomizeX =()=>Math.floor(Math.random()*width)
        Array(count).fill(0).forEach((elem,id)=>{
          this.create.particle({
            x: randomizeX()+x,
            y,
            width:this.settings.particle.width,
            height:this.settings.particle.height,
            hsla: HSLA(Math.floor(360/count*id)).css
          })
        })
      };
      return {
        particle,
        emitter
      };
  }

  outOfBounds = ({ x, y }) => x < 0 || x > this.width || y > this.height;

  update = () => {
    if(this.particles.length > 0) {
      this.particles.forEach(elem => {
        elem.update();
      });
      this.particles = this.particles.filter(elem => !this.outOfBounds(elem));
      this.output = this.particles.length > 0 ? this.draw.output() : null
    }
  };
  get draw () {
    const output=()=>{
      const buffer = this.canvas.create.canvas({});
      this.particles.length > 0 &&
        this.particles.forEach(elem => {
          buffer.ctx.drawImage(elem.sprite, elem.x, elem.y);
        });
      return buffer;
    }

    return{
      output
    }
  };
}
