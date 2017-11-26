import { HSLA, CanvasApi } from './index';

export class FigureGenerator {
  constructor({ cellSize = 40, maxSize = 4 }) {
    this.canvas = new CanvasApi({
      aspectRatio: 1 / 1,
      width: cellSize * maxSize
    });
    this.cellSize = cellSize;
    this.maxSize = maxSize;
  }

  get shapes(){

    class Model{

      constructor({
        elements,        
        cellSize,
      }){
        this.elements = elements;
        this.cellSize = cellSize;
        this.selected = 0;
        this.x = 0;
        this.y = -this.shapeHeight;
      }

      rotateCW=()=>{
        this.selected = this.selected + 1 < this.sprites.length ? this.selected + 1 : 0;
      }
      
      rotateCCW=()=>{
        this.selected = this.selected - 1 >= 0 ? this.selected - 1 : this.sprites.length-1;
      }

      moveY=(val)=>{
        this.y += val;
        return this;
      }

      moveX=(val)=>{
        this.x += val;
        return this;
      }

      alignHorizontal=(grid)=>{
        const left = this.checkCollideFromLeft(grid);
        const right = this.checkCollideFromRight(grid);
        const dir = this.shape.some((row, indexY) => row.some((elem, indexX) => !(this.x + indexX > -1))) ? 1 : -1;
        this.moveX( left ? 1 : right ? -1 : dir);
      }

      isOutOfBoundsX =(grid)=>
        this.shape.some((row, indexY) =>
          row.some((elem, indexX) =>
            this.y + indexY >-1 && elem===1 && grid[this.y + indexY] &&  
            !(this.x + indexX > -1 && this.x + indexX < grid[this.y + indexY].length)
        ));

      isOutOfBoundsY =(grid)=>
        this.shape.some((row, indexY) =>
          row.some((elem, indexX) =>
            this.y + indexY >-1 && elem===1 &&  grid[this.y + indexY] === undefined
        ));

      checkCollideFromLeft=(grid)=>
        this.shape.some((row, y) =>
          row.some((elem, x) =>   
            this.y + y >-1 && 
            grid[this.y + y] && 
            elem === 1 && 
            grid[this.y + y][this.x + x-1] === -1
          ));

      checkCollideFromRight=(grid)=>
      this.shape.some((row, y) =>
        row.some((elem, x) =>   
          this.y + y >-1 && 
          grid[this.y + y] && 
          elem === 1 && 
          grid[this.y + y][this.x + x+1] === -1
        ));

      isCollide = (grid) =>
        this.shape.some((row, indexY) =>
          row.some((elem, indexX) =>     
          this.y + indexY >-1 && grid[this.y + indexY] && elem === 1 && grid[this.y + indexY][this.x + indexX] === -1
        ));

      isOutOfStack=()=>
        this.shape.some((row, indexY) =>
          row.some((elem, indexX) =>
            elem === 1 && this.y + indexY <= 0
        ));

      get width(){
        return this.sprite.width;
      }

      get height(){
        return this.sprite.height;
      }

      get sprites(){
        return this.elements.map((elem)=>elem.sprite);
      }

      get shapes(){
        return this.elements.map((elem)=>elem.shape);
      }

      get shapeWidth(){
        return this.shape[0]
        .map( (elem, x) => this.shape
          .map( (row, y) => row[x] )
            .reduce( (sum, val) => sum+val) )
              .filter(elem=>elem!==0).length
      }

      get shapeHeight(){
        return this.shape
        .map( (row, y) => row
          .reduce( (sum, val) => sum+val ) )
            .reduce( (max, cur) => Math.max(max, cur) )
      }

      get shape(){
        return this.shapes[this.selected];
      }

      get sprite(){
        return this.sprites[this.selected];
      }

    }
    
    const figures = Object.keys(this.create)
      .map( (elem, id) => 
        new Model({
          elements: this.create[elem]({ hsla: HSLA(Math.floor(360/(id+1))) }),        
          cellSize: this.cellSize,
        })
      )
    
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
