import { HSLA, CanvasApi } from './index';

export class FigureGenerator {
  constructor({ cellSize = 40, maxSize = 4, grid=null }) {
    this.canvas = new CanvasApi({
      aspectRatio: 1 / 1,
      width: cellSize * maxSize
    });
    this.cellSize = cellSize;
    this.maxSize = maxSize;
    this.grid = grid;
  }

  get shapes(){

    class Model {
      constructor({ elements, cellSize, grid=null }) {
        this.elements = elements;
        this.cellSize = cellSize;
        this.selected = 0;
        this.x = 0;
        this.y = 0;
        this.grid = grid;
      }
      rotate=(dir)=>{
        const max = this.sprites.length - 1;
        const delta = this.selected+dir;
        const prevSelected = this.selected;
        this.selected = delta < 0 ? max : delta > max ? 0 : delta;
        if(this.collide()){
          const xx = this.getCollisionX(this.getCollisionY())
          const dir = xx > 0 ? -(xx-1) : +1
          this.moveX(dir);
        }
        if(this.checkBoundsX(this.grid.data, 0) || this.checkCollisions(this.grid.data, 0)) this.selected = prevSelected;
      }

      moveY = val => {
        this.y += val;
      };

      moveX = (val) => {
        this.x += val;
        if(this.collide()) this.x -= val;
      };

      alignHorizontal = () => {
        const max = this.shape[0].length;
        const min = -max;
        let counter = 0;
        // const collide =(offset)=> this.checkBoundsX(this.grid, offset) || this.checkCollisions(this.grid, offset);
        const outOfShape=(offset)=>offset > -(this.shape[0].length-1) && offset < 0;
        // const stepOffset=(offset)=> offset > min ?  offset-1 : offset < max ? offset+1;
        let offset = 0;
        // let collision = this.checkBoundsX(grid, 0) || this.checkCollisions(grid, 0);
        // let val = 0;
        // let collisionLeft= this.checkBoundsX(grid, -val) || this.checkCollisions(grid, -val);
        // let collisionRight= this.checkBoundsX(grid, val) || this.checkCollisions(grid, val);

        // console.log(this.collide(grid))

        while(this.collide(offset) && counter < 8){
          counter++;
          // val++;
          offset = -(offset + (offset > 0 ? 1 : -1));
          // offset= offset < 0 ? 1 : (offset+(offset > 0 ? 1 : -1));

          console.log(offset)
          // if(offset > this.shape[0].length) {
          //   offset = 0;
          //   return;
          // }
          // collisionLeft= this.checkBoundsX(grid, -val) || this.checkCollisions(grid, -val);
          // collisionRight= this.checkBoundsX(grid, val) || this.checkCollisions(grid, val);
        }

        // this.moveX(grid, offset);
        // const dir = !collisionLeft ? -val : !collisionRight ? +val : 0;

        // this.moveX(grid, dir);

      };

      collide=(dirX=0, dirY=0)=>this.shape.some(
        (row, y) => !this.grid.data[this.y + y+dirY] || this.someElementIsCollide(row, y, dirX, dirY)
        );

      someElementIsCollide =(row,y, dirX=0, dirY=0)=>row.some((elem, x) => elem && this.grid.isNotValid(this.y + y+dirY, this.x + x+dirX) )


      getCollisionY=(dirX=0, dirY=0)=> this.shape.findIndex(
        (row, y) => !this.grid.data[this.y + y+dirY] || row.some(
          (elem, x) => elem && this.grid.data[this.y + y+dirY][this.x + x+dirX] !== 0
        )
      );

      getCollisionX=(y, dir=0)=>this.shape[y].findIndex(
        (elem, x) => elem && this.grid.data[this.y +y][this.x +x+dir] !== 0
      );

      checkCollisions = (grid, dir) => {
        return this.shape.some((row, y) =>
          row.some(
            (elem, x) =>
              elem === 1 &&
              this.y + y > -1 &&
              grid[this.y + y] &&
              grid[this.y + y][this.x + x + dir] === -1
          )
        );
      };

      checkBoundsX=(grid, dir)=>{
        return this.shape.some((row, y) =>
          row.some(
            (elem, x) =>
              elem === 1 && this.y + y > -1 && grid[this.y + y] &&
              (this.x + x + dir > grid[this.y + y].length-1 || this.x + x + dir < 0)
          )
        );
      }

      getCollideDirection=(grid)=>{

      }



      isOutOfBoundsX = grid => this.shape.some((row, indexY) =>
          row.some(
            (elem, indexX) =>
              this.y + indexY > -1 &&
              elem === 1 &&
              grid[this.y + indexY] &&
              !(
                this.x + indexX > -1 &&
                this.x + indexX < grid[this.y + indexY].length
              )
          )
        );

      isOutOfBoundsY = grid => this.shape.some((row, indexY) =>
          row.some(
            (elem, indexX) =>
              this.y + indexY > -1 &&
              elem === 1 &&
              grid[this.y + indexY] === undefined
          )
        );

      checkCollideFromLeft = grid => this.checkBoundsX(grid, -1) || this.checkCollisions(grid, -1)

      checkCollideFromRight = grid => this.checkBoundsX(grid, +1) || this.checkCollisions(grid, +1)

      isCollide = grid => this.shape.some((row, indexY) =>
          row.some(
            (elem, indexX) =>
              this.y + indexY > -1 &&
              grid[this.y + indexY] &&
              elem === 1 &&
              grid[this.y + indexY][this.x + indexX] === -1
          )
        );

      isOutOfStack = () => this.shape.some((row, indexY) =>
          row.some((elem, indexX) => elem === 1 && this.y + indexY <= 4)
        );

      get width() {
        return this.sprite.width;
      }

      get height() {
        return this.sprite.height;
      }

      get sprites() {
        return this.elements.map(elem => elem.sprite);
      }

      get shapes() {
        return this.elements.map(elem => elem.shape);
      }

      get shapeWidth() {
        return this.shape[0]
          .map((elem, x) =>
            this.shape
              .map((row, y) => row[x])
              .reduce((sum, val) => sum + val)
          )
          .filter(elem => elem !== 0).length;
      }

      get shapeHeight() {
        return this.shape
          .map((row, y) => row.reduce((sum, val) => sum + val))
          .reduce((max, cur) => Math.max(max, cur));
      }

      get shape() {
        return this.shapes[this.selected];
      }

      get sprite() {
        return this.sprites[this.selected];
      }
    }

    const figures = Object.keys(this.create)
      .map( (elem, id, array) =>
        new Model({
          elements: this.create[elem]({ hsla: HSLA(Math.floor(360/array.length*id), 65) }),
          cellSize: this.cellSize,
          grid: this.grid
        }))

    const randomFigure =()=> figures[Math.floor(Math.random()*figures.length)];

    return{
      figures,
      randomFigure
    }
  }

  get create() {

    const block = ({
      width = this.cellSize,
      height = this.cellSize,
      hsla = HSLA(200)
    }) => {
      const rect = this.canvas.draw.rect({
        width,
        height,
        background: hsla.css
      });
      const gradientBorder = this.canvas.draw.border({
        width,
        height,
        strokeStyle: [
          hsla.light(+25).css,
          hsla.light(-20).css,
          hsla.light(-25).css,
          hsla.light(+20).css
        ]
      });
      return this.canvas.compose.normal(rect, gradientBorder);
    };

    const drawShape = ({ shape, sprite }) => {
      const width = this.cellSize * shape[0].length;
      const height = this.cellSize * shape.length;
      const canvas = this.canvas.create.canvas({ width, height });
      shape.forEach((row, y) => row.forEach((elem, x) => {
          elem === 1 && canvas.ctx.drawImage(sprite, x * sprite.width, y * sprite.height);
        }));
      return { shape, sprite: canvas };
    };

    const block_4X1 = ({
      hsla = HSLA(200)
    }) => {

      const shapes = [
        [
          [0,0,0,0],
          [0,0,0,0],
          [0,0,0,0],
          [1,1,1,1]
        ],
        [
          [1,0,0,0],
          [1,0,0,0],
          [1,0,0,0],
          [1,0,0,0]
        ]
      ]

      const sprite = block({ hsla });

      return shapes.map( shape => drawShape({ shape, sprite }) );

    };

    const block_2X2 = ({
      hsla = HSLA(200)
    }) => {
      const shapes = [
        [
          [1,1],
          [1,1]
        ]
      ];
      const sprite = block({ hsla });

      return shapes.map( shape => drawShape({ shape, sprite }) );
    };

    const block_Z = ({
      hsla = HSLA(200),
    }) => {

      const shapes = [
        [
          [0,0,0],
          [1,1,0],
          [0,1,1]
        ],
        [
          [0,0,1],
          [0,1,1],
          [0,1,0]
        ]
      ]

      const sprite = block({ hsla });

      return shapes.map( shape => drawShape({ shape, sprite }) );
    };

    const block_CWZ = ({
      hsla = HSLA(200),
    }) => {

      const shapes = [
        [
          [0,0,0],
          [0,1,1],
          [1,1,0]
        ],
        [
          [1,0,0],
          [1,1,0],
          [0,1,0]
        ]
      ]

      const sprite = block({ hsla });

      return shapes.map( shape => drawShape({ shape, sprite }) );
    };

    const block_L = ({
      hsla = HSLA(200),
    }) => {
      const shapes = [
        [
          [1,0,0],
          [1,0,0],
          [1,1,0]
        ],
        [
          [0,0,0],
          [1,1,1],
          [1,0,0]
        ],
        [
          [0,1,1],
          [0,0,1],
          [0,0,1]
        ],
        [
          [0,0,0],
          [0,0,1],
          [1,1,1]
        ]
      ]

      const sprite = block({ hsla });

      return shapes.map( shape => drawShape({ shape, sprite }) );
    };

    const block_CWL = ({
      hsla = HSLA(200),
    }) => {
      const shapes = [
        [
          [0,0,1],
          [0,0,1],
          [0,1,1]
        ],
        [
          [0,0,0],
          [1,0,0],
          [1,1,1]
        ],
        [
          [1,1,0],
          [1,0,0],
          [1,0,0]
        ],
        [
          [0,0,0],
          [1,1,1],
          [0,0,1]
        ]
      ]

      const sprite = block({ hsla });

      return shapes.map( shape => drawShape({ shape, sprite }) );
    };

    const block_T = ({
      hsla = HSLA(200),
    }) => {
      const shapes = [
        [
          [0,0,0],
          [0,1,0],
          [1,1,1]
        ],
        [
          [1,0,0],
          [1,1,0],
          [1,0,0]
        ],
        [
          [0,0,0],
          [1,1,1],
          [0,1,0]
        ],
        [
          [0,0,1],
          [0,1,1],
          [0,0,1]
        ]
      ]

      const sprite = block({ hsla });

      return shapes.map( shape => drawShape({ shape, sprite }) );
    };

    return {
      block_2X2,
      block_4X1,
      block_Z,
      block_CWZ,
      block_L,
      block_CWL,
      block_T
    };
  }
}
