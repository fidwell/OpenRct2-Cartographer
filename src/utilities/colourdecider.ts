import { Colour } from "../enums/colour";
import Options from "../models/options";
import ColourUtilities from "./colourutilities";
import PeepFinder from "./peepfinder";

export default class ColourDecider {
  static getColourAtTile(x: number, y: number, options: Options, peepFinder: PeepFinder): number {
    const tile = map.getTile(x + 1, y + 1); // Off-by-one index

    if (options.showPeeps) {
      if (peepFinder.peepCount[x][y] > 0) {
        return ColourUtilities.gradientPaletteValue(peepFinder.peepCount[x][y], peepFinder.maxPeeps);
      }
    }

    const validElements = tile.elements.filter((e) => this.isValidElement(e, options));

    if (validElements.length === 0) {
      return ColourUtilities.colourToPalette(Colour.Void);
    }

    const topElement = validElements.reduce((prev, current) => (prev.baseHeight > current.baseHeight ? prev : current));

    if (!topElement) {
      return ColourUtilities.colourToPalette(Colour.Void);
    }

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
        return this.getColourFromSurface(topElement as SurfaceElement, options);
      default:
        return ColourUtilities.colourToPalette(Colour.Void);
    }
  }

  static isValidElement(e: TileElement, options: Options): boolean {
    if (e.isHidden) return false;

    if (e.type === "track") {
      const tE = e as TrackElement;
      const ride = map.getRide(tE.ride);

      if (!options.showOpenRides && ride.status === "open") return false;
      if (!options.showTestingRides && ride.status === "testing") return false;
      if (!options.showClosedRides && (ride.status === "closed" || ride.status === "simulating")) return false;

      return [80, 82, 83, 84, 85, 89].indexOf(ride.type) === -1;
    }

    return (options.showFootpath && e.type === "footpath")
      || (options.showScenery && (e.type === "small_scenery" || e.type === "large_scenery"))
      || e.type === "surface";
  }

  static getColourFromTrack(element: TrackElement): number {
    const ride = map.getRide(element.ride);

    if (element.rideType === 20) { // Skip if maze
      return ColourUtilities.colourToPalette(Colour.DarkGreen);
    }

    if (element.colourScheme !== undefined && element.colourScheme !== null) {
      const scheme = ride.colourSchemes[element.colourScheme];
      return ColourUtilities.colourToPalette(scheme ? scheme.main : ColourUtilities.colourToPalette(Colour.White));
    }

    return ColourUtilities.colourToPalette(Colour.Void);
  }

  static getColourFromSmallScenery(element: SmallSceneryElement) {
    return ColourUtilities.colourToPalette(element.primaryColour);
  }

  static getColourFromLargeScenery(element: LargeSceneryElement) {
    return ColourUtilities.colourToPalette(element.primaryColour);
  }

  static getColourFromFootpath(element: FootpathElement): number {
    return ColourUtilities.footpathToPalette(element.surfaceObject ?? element.object ?? 0);
  }

  static getColourFromSurface(element: SurfaceElement, options: Options): number {
    if (options.showWater && element.waterHeight > element.baseHeight) {
      return ColourUtilities.water();
    }

    return options.showSurface ? ColourUtilities.surfaceToPalette(element.surfaceStyle) : ColourUtilities.colourToPalette(Colour.Void);
  }
}
