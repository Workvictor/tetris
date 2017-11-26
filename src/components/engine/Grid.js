export class Grid {
  constructor({ width, height }) {
    this.data = Array(height).fill(Array(width).fill(0));
  }

  get randomX() {
    return Math.random() * this.data[0].length - 1;
  }

  row(y) {
    if (y >= 0 && this.data.length > y) return this.data[y];
  }

  column(x) {
    if (x >= 0 && this.data[0].length > x)
      return this.data.map((row, index) => row[x]);
  }

  isShapeCollide = ({ shape, x, y }) => 
    shape.some((row, indexY) =>
      row.some((elem, indexX) => {
        return elem !==0 && this.data[y + indexY][x + indexX] === -1
      })
    );

  addShapeLanded = ({ shape, x, y }) => {
    shape.forEach((row, indexY) =>
      row.forEach((elem, indexX) => {
        if (y + indexY >= 0) {
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
  };

  addShape = ({ shape, x, y }) => {
    shape.forEach((row, indexY) =>
      row.forEach((elem, indexX) => {
        if (y + indexY >= 0) {
          this.data = [
            ...this.data.slice(0, y + indexY),
            [
              ...this.data[y + indexY].slice(0, x + indexX),
              elem,
              ...this.data[y + indexY].slice(x + indexX + 1)
            ],
            ...this.data.slice(y + indexY + 1)
          ];
        }
      })
    );
  };
}
