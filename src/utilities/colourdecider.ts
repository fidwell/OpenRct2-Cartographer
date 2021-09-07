import { Colour } from "../enums/colour";
import { Footpath } from "../enums/footpath";
import Options from "../models/options";
import ColourUtilities from "./colourutilities";
import * as Log from "./logger";

export default class ColourDecider {
  static getColourAtTile(x: number, y: number, options: Options): number {
    const tile = map.getTile(x + 1, y + 1); // Off-by-one index

    const topElement = tile.elements
      .filter(e => this.isValidElement(e, options))
      .reduce((prev, current) => prev.baseHeight > current.baseHeight ? prev : current);

    switch (topElement.type) {
      case "track":
        return this.getColourFromTrack(topElement as TrackElement);
      case "footpath":
        return this.getColourFromFootpath(topElement as FootpathElement);
      case "small_scenery":
        return this.getColourFromSmallScenery(topElement as SmallSceneryElement);
      case "large_scenery":
        return this.getColourFromLargeScenery(topElement as LargeSceneryElement);
      case "surface":
      default:
        return this.getColourFromSurface(topElement as SurfaceElement);
    }
  }

  static isValidElement(e: TileElement, options: Options): boolean {
    if (e.isHidden) return false;

    if (e.type === "track") {
      if (!options.showRides) return false;

      const tE = e as TrackElement;
      const ride = map.getRide(tE.ride);
      return ride.type <= 97 && [82, 83, 84, 85, 89].indexOf(ride.type) == -1;
    }

    return (options.showFootpath && e.type === "footpath") ||
      (options.showScenery && (e.type === "small_scenery" || e.type === "large_scenery")) ||
      e.type === "surface";
  }

  static getColourFromTrack(element: TrackElement): number {
    const ride = map.getRide(element.ride);
    const scheme = ride.colourSchemes[element.colourScheme];
    return ColourUtilities.colourToPalette(scheme ? scheme.main : ColourUtilities.colourToPalette(Colour.White));
  }

  static getColourFromSmallScenery(element: SmallSceneryElement) {
    return ColourUtilities.colourToPalette(element.primaryColour);
  }

  static getColourFromLargeScenery(element: LargeSceneryElement) {
    return ColourUtilities.colourToPalette(element.primaryColour);
  }

  static getColourFromFootpath(element: FootpathElement): number {
    return this.getColourFromFootpathType(element.object);
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
      case Footpath.Road:
      case Footpath.Road2:
        return ColourUtilities.colourToPalette(Colour.Grey);
      case Footpath.Wooden: return ColourUtilities.colourToPalette(Colour.LightBrown);
      case Footpath.Ash: return ColourUtilities.colourToPalette(Colour.Black);
    }

    Log.debug(`${object}`);
    return 173; // unknown
  }
}
