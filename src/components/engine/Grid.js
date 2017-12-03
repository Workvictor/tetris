import { CanvasApi, STORE, ACTIONS } from './index';
export class Grid {
  constructor({ width, height, cellSize, offset = 0 }) {
    this.offset = offset;
    this.cellSize = cellSize;
    this.width = width;
    this.height = height + offset;

    this.canvas = new CanvasApi({
      aspectRatio: this.width / this.height,
      width: this.cellSize * this.width
    });

    this.data = Array(this.height).fill(Array(this.width).fill(0));

    this.sprite = this.canvas.create.canvas({
      width: this.width * cellSize,
      height: this.height * cellSize
    });
    this.linesDataSprites = Array(height).fill(null);
  }

  updateGameScore = score => {
    const deltaScore = score - this.gameScore;
    const incrementStep = Math.floor(
      deltaScore / this.store.game.incrementCount
    );
    const scoreStack = Array(this.store.game.incrementCount).fill(
      incrementStep
    );
    const scoreStackSum = scoreStack.reduce(
      (sum, val) => sum + val,
      this.gameScore
    );
    scoreStackSum < score && scoreStack.push(score - scoreStackSum);

    STORE.dispatch(ACTIONS.updateGame({ score }));
    STORE.dispatch(ACTIONS.updateScoreStack({ scoreStack }));
  };

  isNotValid = (y = 0, x = 0) => this.data[y][x] !== 0;

  reset = () => {
    this.data = Array(this.height).fill(Array(this.width).fill(0));
    this.sprite = this.canvas.create.canvas({
      width: this.width * this.cellSize,
      height: this.height * this.cellSize
    });
  };

  get action() {
    const updateLinesCount = (linesCount = 0, dropDelay = 0) =>
      STORE.dispatch(
        ACTIONS.updateGame({
          linesCount,
          dropDelay
        })
      );
    return {
      updateLinesCount
    };
  }

  get store() {
    return STORE.getState();
  }

  get gameScore() {
    return STORE.getState().game.score;
  }

  get emptyLine() {
    return Array(this.data[0].length).fill(0);
  }

  randomX = (
    { shape },
    min = 0,
    max = this.data[0].length - 1 - shape[0].length
  ) => Math.floor(min + (Math.random() * max - min));

  sliceSprite = () => {
    const getSpriteLine = y => {
      const width = this.data[0].length * this.cellSize;
      const height = this.cellSize;
      const buffer = this.canvas.create.canvas({ width, height });
      buffer.ctx.drawImage(
        this.sprite,
        0,
        y * this.cellSize,
        width,
        height,
        0,
        0,
        width,
        height
      );
      return buffer;
    };
    this.linesDataSprites = this.data.map((row, indexY) =>
      getSpriteLine(indexY)
    );
  };

  row(y) {
    if (y >= 0 && this.data.length > y) return this.data[y];
  }

  column(x) {
    if (x >= 0 && this.data[0].length > x)
      return this.data.map((row, index) => row[x]);
  }

  renderLinesData = () => {
    const width = this.data[0].length * this.cellSize;
    const height = this.data.length * this.cellSize;
    let buffer = this.canvas.create.canvas({ width, height });
    this.linesDataSprites.forEach((elem, y) => {
      if (elem)
        buffer = this.canvas.compose.normal(buffer, elem, 0, y * this.cellSize);
    });
    this.sprite = buffer;
  };

  addShapeLanded = ({ shape, x, y, sprite }) => {
    shape.forEach((row, indexY) =>
      row.forEach((elem, indexX) => {
        if (y + indexY >= 0 && elem === 1) {
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
    this.sprite = this.canvas.compose.normal(
      this.sprite,
      sprite,
      x * this.cellSize,
      y * this.cellSize
    );
    this.sliceSprite();
    this.checkLinesFullness();
  };

  removeLine = (lineIndex, multiplierIndex) => {
    const { lineScore, lineMultiplier } = this.store.game;
    this.data = [
      this.emptyLine,
      ...this.data.slice(0, lineIndex),
      ...this.data.slice(lineIndex + 1)
    ];
    this.linesDataSprites = [
      null,
      ...this.linesDataSprites.slice(0, lineIndex),
      ...this.linesDataSprites.slice(lineIndex + 1)
    ];
    this.renderLinesData();
    multiplierIndex === 3 &&
      this.store.audioController.playSoundByROLE('SFX_combo');
    const score =
      multiplierIndex > 0
        ? lineScore * lineMultiplier * multiplierIndex
        : lineScore;
    this.updateGameScore(Math.floor(this.gameScore + score));
  };

  removeLinesStack = lines => {
    const linesCount = this.store.game.linesCount + lines.length;
    const dropDelay = this.store.game.dropDelay - lines.length;
    this.action.updateLinesCount(linesCount, dropDelay);
    lines.forEach(this.removeLine);
    this.store.audioController.playSoundByROLE('SFX_remove');
  };

  checkLinesFullness = () => {
    const lines = this.data
      .map((row, y) => ({ row, y }))
      .filter(({ row, y }) => row.every(elem => elem === -1))
      .map(elem => elem.y);
    lines.length > 0 && this.removeLinesStack(lines);
  };
}
