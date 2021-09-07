import ColourUtilities from "./colourutilities";
import * as Log from "./logger";

export default class ColourDecider {
  static getColourAtTile(x: number, y: number): number {
    const tileHere = map.getTile(x + 1, y + 1); // Off-by-one index
    const surfaceElements = tileHere.elements.filter(e => e.type === "surface");

    if (surfaceElements.length >= 1) {
      // It is possible to have multiple surface elements on one tile.
      // If so, we should find the highest one instead of whichever is first.
      const surfaceElement: SurfaceElement = surfaceElements[0] as SurfaceElement;
      return ColourUtilities.surfaceToPalette(surfaceElement.surfaceStyle);
    } else if (surfaceElements.length === 0) {
      Log.warning(`No surface found at (${x},${y})`);
    }

    return 0;
  }
}
