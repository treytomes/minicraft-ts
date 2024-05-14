import {Color, TileSet} from './system/display';

export default class NineSlice {
  private readonly tileset: TileSet;

  // The index of the top-left tile of the 9-slice.
  private readonly tileIndex: number;

  private readonly columns: number;
  private readonly rows: number;

  constructor(
    tileset: TileSet,
    tileIndex: number,
    columns: number,
    rows: number
  ) {
    this.tileset = tileset;
    this.tileIndex = tileIndex;
    this.columns = columns;
    this.rows = rows;
  }

  render(x: number, y: number, colors: Color[]) {
    // top-left
    this.tileset.render(this.tileIndex, x, y, colors);

    // top-right
    this.tileset.render(
      this.tileIndex + 2,
      x + this.tileset.tileWidth * (this.columns - 1),
      y,
      colors
    );

    // bottom-left
    this.tileset.render(
      this.tileIndex + this.tileset.tilesPerRow * 2,
      x,
      y + this.tileset.tileHeight * (this.rows - 1),
      colors
    );

    // bottom-right
    this.tileset.render(
      this.tileIndex + 2 + this.tileset.tilesPerRow * 2,
      x + this.tileset.tileWidth * (this.columns - 1),
      y + this.tileset.tileHeight * (this.rows - 1),
      colors
    );

    // left
    for (let row = 1; row < this.rows - 1; row++) {
      this.tileset.render(
        this.tileIndex + this.tileset.tilesPerRow,
        x,
        y + this.tileset.tileHeight * row,
        colors
      );
    }

    // right
    for (let row = 1; row < this.rows - 1; row++) {
      this.tileset.render(
        this.tileIndex + 2 + this.tileset.tilesPerRow,
        x + this.tileset.tileWidth * (this.columns - 1),
        y + this.tileset.tileHeight * row,
        colors
      );
    }

    // top
    for (let col = 1; col < this.columns - 1; col++) {
      this.tileset.render(
        this.tileIndex + 1,
        x + this.tileset.tileWidth * col,
        y,
        colors
      );
    }

    // bottom
    for (let col = 1; col < this.columns - 1; col++) {
      this.tileset.render(
        this.tileIndex + 1 + this.tileset.tilesPerRow * 2,
        x + this.tileset.tileWidth * col,
        y + this.tileset.tileHeight * (this.rows - 1),
        colors
      );
    }

    // center
    for (let row = 1; row < this.rows - 1; row++) {
      for (let col = 1; col < this.columns - 1; col++) {
        this.tileset.render(
          this.tileIndex + this.tileset.tilesPerRow + 1,
          x + this.tileset.tileWidth * col,
          y + this.tileset.tileHeight * row,
          colors
        );
      }
    }
  }
}
