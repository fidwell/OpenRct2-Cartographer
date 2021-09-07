import { Colour } from "../enums/colour";
import { Footpath } from "../enums/footpath";
import ColourUtilities from "./colourutilities";
import * as Log from "./logger";

export default class ColourDecider {
  static getColourAtTile(x: number, y: number): number {
    const tile = map.getTile(x + 1, y + 1); // Off-by-one index

    const topElement = tile.elements
      .filter(t => t.type === "footpath" || t.type === "surface")
      .reduce((prev, current) => prev.baseHeight > current.baseHeight ? prev : current);

    switch (topElement.type) {
      case "footpath":
        return this.getColourFromFootpath(topElement as FootpathElement);
      case "surface":
      default:
        return this.getColourFromSurface(topElement as SurfaceElement);
    }
  }

  static getColourFromFootpath(tile: FootpathElement): number {
    return this.getColourFromFootpathType(tile.object);
  }

  static getColourFromSurface(element: SurfaceElement): number {
    if (element.waterHeight > element.baseHeight) {
      return ColourUtilities.water();
    }

    return ColourUtilities.surfaceToPalette(element.surfaceStyle);
  }

  private static getColourFromFootpathType(object: number): number {
    switch (object) {
      case Footpath.Sidewalk: return ColourUtilities.colourToPalette(Colour.DarkYellow);
      case Footpath.BrownTarmac: return ColourUtilities.colourToPalette(Colour.DarkBrown);
      case Footpath.CrazyPaving: return ColourUtilities.colourToPalette(Colour.LightBrown);
      case Footpath.Dirt: return ColourUtilities.colourToPalette(Colour.SaturatedBrown);
      case Footpath.Space: return ColourUtilities.colourToPalette(Colour.BordeauxRed);
      case Footpath.Tarmac: return ColourUtilities.colourToPalette(Colour.Grey);
      case Footpath.Road: return ColourUtilities.colourToPalette(Colour.Grey);
      case Footpath.Wooden: return ColourUtilities.colourToPalette(Colour.LightBrown);
      case Footpath.Ash: return ColourUtilities.colourToPalette(Colour.Black);
    }

    Log.debug(`${object}`);
    return 173; // unknown
  }
}
