import ColourUtilities from "./colourutilities";
import * as Log from "./logger";

export default class ColourDecider {
  static getColourAtTile(x: number, y: number): number {
    const tile = map.getTile(x + 1, y + 1); // Off-by-one index
    return this.getColorFromSurface(tile);
  }

  static getColorFromSurface(tile: Tile): number {
    const surfaceElements = tile.elements.filter(e => e.type === "surface");

    if (surfaceElements.length >= 1) {
      let surfaceElement: SurfaceElement;

      if (surfaceElements.length > 1) {
        surfaceElement = surfaceElements.reduce((prev, current) => prev.baseHeight > current.baseHeight ? prev : current) as SurfaceElement;
      } else {
        surfaceElement = surfaceElements[0] as SurfaceElement;
      }

      if (surfaceElement.waterHeight > surfaceElement.baseHeight) {
        return ColourUtilities.water();
      }

      return ColourUtilities.surfaceToPalette(surfaceElement.surfaceStyle);
    } else if (surfaceElements.length === 0) {
      Log.warning(`No surface found at (${tile.x},${tile.y})`);
    }

    return 0;
  }
}
