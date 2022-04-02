export default class Graphics {
  static draw(
    tileSize: number,
    mapSize: number,
    rotation: number,
    mapColours: number[][],
    g: GraphicsContext): void {
    g.fill = 1; // Yes fill
    g.stroke = 0; // No stroke

    for (let x = 0; x < mapSize; x += 1) {
      for (let y = 0; y < mapSize; y += 1) {
        let colour: number;
        switch (rotation) {
          case 1: colour = mapColours[-y + mapSize - 1][x]; break;
          case 2: colour = mapColours[-x + mapSize - 1][-y + mapSize - 1]; break;
          case 3: colour = mapColours[y][-x + mapSize - 1]; break;
          default: colour = mapColours[x][y]; break;
        }

        g.colour = colour;
        g.fill = colour;
        g.rect(x * tileSize, (mapSize - y) * tileSize, tileSize, tileSize);
      }
    }
  }

  static allocateImage(pixelData: PixelData) {
    var range = ui.imageManager.allocate(1);
    if (range) {
      ui.imageManager.setPixelData(range.start, pixelData);
      return range.start;
    }
    return undefined;
  }
}
