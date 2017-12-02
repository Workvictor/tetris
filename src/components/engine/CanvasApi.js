import { HSLA } from './index';
export class CanvasApi {
  constructor({
    HTML_canvas = document.createElement('canvas'),
    width = 640,
    aspectRatio = 16 / 9,
    cellSize = 1,
    ctxStyles=this.ctxDefaultStyles
  }) {
    const height = Math.floor(width / aspectRatio);
    this.ctxStyles = ctxStyles;
    this.cellSize = cellSize;
    this.initialSetup(HTML_canvas, width, height);
  }

  get ctxDefaultStyles(){
    return {
      fillStyle: "#000000",
      filter: "none",
      font: '14px Arial, serif',
      globalAlpha: 1,
      globalCompositeOperation: "source-over",
      imageSmoothingEnabled: false,
      imageSmoothingQuality: "low",
      lineCap: "butt",
      lineDashOffset: 0,
      lineJoin: "miter",
      lineWidth: 1,
      miterLimit: 10,
      shadowBlur: 0,
      shadowColor: "rgba(0, 0, 0, 0)",
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      strokeStyle: "#000000",
      textAlign: "center",
      textBaseline: "middle",
    }
  }

  set HTML_canvas(HTML_canvas){
    const width = this.width;
    const height = this.height;
    this.initialSetup(HTML_canvas, width, height);
  }

  initialSetup=(HTML_canvas, width, height)=>{
    this.CV = HTML_canvas;
    this.CV.width = width;
    this.CV.height = height;
    this.CV.CTX = this.CV.getContext('2d');
    this.ctxSetup(this.ctxStyles);
  }

  ctxSetup=(ctxStyles={})=>{
    this.ctxStyles = {
      ...this.ctxStyles,
      ...ctxStyles
    };
    Object.keys(this.ctxStyles).forEach( property => this.CV.CTX[property] = ctxStyles[property] )
  }

  get self(){
    return this.CV;
  }

  get height(){
    return this.CV.height;
  }

  get width(){
    return this.CV.width;
  }

  get ctx() {
    return this.CV.CTX;
  }

  get compose() {
    const option = (layerA, layerB, compositeOperation, offsetX, offsetY ) => {
      const buffer = createCanvas(layerA);
      buffer.ctx.globalCompositeOperation = compositeOperation || 'source-over';
      buffer.ctx.drawImage(layerA, 0, 0);
      buffer.ctx.drawImage(layerB, offsetX, offsetY);
      return buffer;
    };

    const normal = (layerA, layerB, offsetX=0, offsetY=0 ) => option(layerA, layerB, 'source-over', offsetX, offsetY);

    const sourceIn = (layerA, layerB, offsetX=0, offsetY=0 ) => option(layerA, layerB, 'source-in', offsetX, offsetY);

    const screen = (layerA, layerB, offsetX=0, offsetY=0 ) => option(layerA, layerB, 'screen', offsetX, offsetY);

    const overlay = (layerA, layerB, offsetX=0, offsetY=0 ) => option(layerA, layerB, 'overlay', offsetX, offsetY);

    return {
      normal,
      sourceIn,
      screen,
      overlay
    };
  }

  vector2=(x, y)=>({x, y});

  get create(){

    const canvas = ({ width, height }) => {
      const buffer = document.createElement('canvas');
      buffer.width = width;
      buffer.height = height;
      buffer.ctx = buffer.getContext('2d');
      return buffer;
    };

    const gradient=({
      width=100,
      height=100,
      direction=[0, 0, 100, 0],
      colorStops=[
        [0, HSLA(0, 0, 0).css],
        [0.25, HSLA(0, 0, 0).css],
        [0.25, HSLA(0, 0, 0).css],
        [0.5, HSLA(0, 0, 0).css],
        [0.5, HSLA(0, 0, 0).css],
        [0.75, HSLA(0, 0, 0).css],
        [0.75, HSLA(0, 0, 0).css],
        [1, HSLA(0, 0, 0).css],
      ]
    })=>{
      const buffer = createCanvas({ width, height });
      const gradient = buffer.ctx.createLinearGradient(direction[0], direction[1], direction[2], direction[3]);
      colorStops.forEach(
        elem=>gradient.addColorStop(elem[0], elem[1])
      );
      return gradient;
    }

    return({
      gradient,
      canvas
    })

  }

  get draw() {

    const rect = ({
      width = this.CV.width,
      height = this.CV.height,
      background = HSLA(0, 0, 0).css
    }) => {
      const buffer = createCanvas({ width, height });
      buffer.ctx.fillStyle = background;
      buffer.ctx.fillRect(0, 0, width, height);
      return buffer;
    };

    const vertex =({
      width=100,
      height=100,
      fillStyle = HSLA(120).css,
      preset='top',
      pointsArray,
    })=>{
      const preSetup={
        top:    [this.vector2(width/2,height/2), this.vector2(0,0),          this.vector2(width,0)],
        right:  [this.vector2(width/2,height/2), this.vector2(width,0),      this.vector2(width,height)],
        bottom: [this.vector2(width/2,height/2), this.vector2(width,height), this.vector2(0,height)],
        left:   [this.vector2(width/2,height/2), this.vector2(0,height),     this.vector2(0,0)],
      };

      const buffer = createCanvas({ width, height });
      buffer.ctx.fillStyle = fillStyle;

      const points = pointsArray || preSetup[preset];

      buffer.ctx.beginPath();
      buffer.ctx.moveTo(points[0].x, points[0].y);
      buffer.ctx.lineTo(points[1].x, points[1].y);
      buffer.ctx.lineTo(points[2].x, points[2].y);
      buffer.ctx.lineTo(points[0].x, points[0].y);
      buffer.ctx.fill();

      return buffer;
    }

    const border=({
      width = this.CV.width,
      height = this.CV.height,
      strokeStyle = [
        HSLA(200).light(+25).css,
        HSLA(200).light(-20).css,
        HSLA(200).light(-25).css,
        HSLA(200).light(+20).css
      ],
      lineWidth = 4,
    })=>{
      const borders = ['top', 'right', 'bottom', 'left'];
      const patternBuffer = createCanvas({ width, height });
      borders.forEach(
        (elem, id)=>{
          const vertex = this.draw.vertex({
            width,
            height,
            preset: elem,
            fillStyle: typeof strokeStyle === 'string' ? strokeStyle : strokeStyle[id],
          });
          patternBuffer.ctx.drawImage(vertex, 0, 0);
        }
      );

      const pattern = createCanvas({ width, height }).ctx.createPattern(patternBuffer, 'no-repeat');

      const buffer = createCanvas({ width, height });
      buffer.ctx.strokeStyle = pattern;
      buffer.ctx.lineWidth = lineWidth;

      const offset = Math.floor(lineWidth/2);

      buffer.ctx.beginPath();
      buffer.ctx.moveTo(0, offset);
      buffer.ctx.lineTo(width-offset, offset);
      buffer.ctx.lineTo(width-offset, height-offset);
      buffer.ctx.lineTo(offset, height-offset);
      buffer.ctx.lineTo(offset, 0);
      buffer.ctx.stroke();

      return buffer;
    }

    const grid = ({
      width = this.CV.width,
      height = this.CV.height,
      strokeStyle = HSLA(0, 100, 100).css,
      lineWidth = 1,
      cellSize = this.cellSize,
      globalAlpha = 1,
      shadowBlur = 10,
      shadowColor
    }) => {
      const pattern = createCanvas({ width: cellSize, height: cellSize });
      pattern.ctx.globalAlpha = globalAlpha;
      pattern.ctx.strokeStyle = strokeStyle;
      pattern.ctx.lineWidth = lineWidth;
      pattern.ctx.shadowBlur = shadowBlur;
      pattern.ctx.shadowColor = shadowColor || strokeStyle;

      pattern.ctx.beginPath();
      pattern.ctx.moveTo(0, 0);
      pattern.ctx.lineTo(cellSize, 0);
      pattern.ctx.lineTo(cellSize, cellSize);
      pattern.ctx.stroke();

      const patternBuffer = createCanvas({
        width: cellSize,
        height: cellSize
      }).ctx.createPattern(pattern, 'repeat');

      const buffer = createCanvas({ width, height });
      buffer.ctx.fillStyle = patternBuffer;
      buffer.ctx.fillRect(0, 0, width, height);
      return buffer;
    };
    return {
      rect,
      grid,
      border,
      vertex
    };
  }
}

const createCanvas = ({ width, height }) => {
  const buffer = document.createElement('canvas');
  buffer.width = width;
  buffer.height = height;
  buffer.ctx = buffer.getContext('2d');
  return buffer;
};
