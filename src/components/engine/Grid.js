import { CanvasApi } from './index';
export class Grid {
  constructor({ width, height, cellSize }) {
    this.data = Array(height).fill(Array(width).fill(0));
    this.canvas = new CanvasApi({
      aspectRatio: 10 / 20,
      width: cellSize * width
    });
    this.cellSize = cellSize;
    this.sprite = this.canvas.create.canvas({ width:width*cellSize, height:height*cellSize });
    this.linesDataSprites = Array(height).fill(this.drawEmptyLine);
  }

  get drawEmptyLine(){
    return this.canvas.create.canvas({ 
      width: this.data[0].length*this.cellSize, 
      height: this.cellSize
    });
  }

  get addEmptyLine(){
    return Array(this.data[0].length).fill(0);
  }
  
  get randomX() {
    return Math.floor(Math.random() * this.data[0].length - 1);
  }

  

  sliceSprite=()=>{
    const getSpriteLine = y => {
      const width = this.data[0].length * this.cellSize;
      const height = this.cellSize;
      const buffer = this.canvas.create.canvas({ width, height });
      buffer.ctx.drawImage(this.sprite, 0, y * this.cellSize, width, height, 0, 0, width, height);
      return buffer;
    };
    this.linesDataSprites = this.data.map((row, indexY) => getSpriteLine(indexY))
  }

  row(y) {
    if (y >= 0 && this.data.length > y) return this.data[y];
  }

  column(x) {
    if (x >= 0 && this.data[0].length > x)
      return this.data.map((row, index) => row[x]);
  }

  renderLinesData=()=>{
    const width = this.data[0].length * this.cellSize;
    const height = this.data.length * this.cellSize;
    let buffer = this.canvas.create.canvas({ width, height });
    this.linesDataSprites.forEach((elem, y) => {
      buffer = this.canvas.compose.normal(buffer, elem, 0, y*this.cellSize);
    })
    this.sprite = buffer;
  }

  addShapeLanded = ({ shape, x, y, sprite }) => {
    shape.forEach((row, indexY) =>
      row.forEach((elem, indexX) => {
        if (y + indexY >= 0 && elem===1) {
          this.data = [
            ...this.data.slice(0, y + indexY),
            [
              ...this.data[y + indexY].slice(0, x + indexX),
              -1,
              ...this.data[y + indexY].slice(x + indexX + 1)
            ],
            ...this.data.slice(y + indexY + 1)
          ];
        }
      })
    );
    this.sprite = this.canvas.compose.normal(this.sprite, sprite, x*this.cellSize, y*this.cellSize);
    this.sliceSprite();
    this.checkLinesFullnes();
  };

  removeLine=(lineIndex)=>{
    this.data = [
      this.addEmptyLine,
      ...this.data.slice(0, lineIndex),
      ...this.data.slice(lineIndex + 1)
    ];
    this.linesDataSprites = [
      this.drawEmptyLine,
      ...this.linesDataSprites.slice(0, lineIndex),
      ...this.linesDataSprites.slice(lineIndex + 1)
    ];
    this.renderLinesData();
  }

  checkLinesFullnes=()=>{
    this.data.forEach((row, y)=>{
      row.every(elem=>elem === -1)  && this.removeLine(y)
    })
  }

}
