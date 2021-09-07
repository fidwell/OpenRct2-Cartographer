import { Colour } from "../enums/colour";
import { Palette } from "../enums/palette";
import { Terrain } from "../enums/terrain";

export default class ColourUtilities {
  static surfaceToPalette(surface: number): number {
    switch (surface) {
      case Terrain.Grass: return 144;
      case Terrain.Sand: return 299;
      case Terrain.Dirt: return 34;
      case Terrain.Rock: return 12;
      case Terrain.Martian: return 63;
      case Terrain.Checkerboard: return 20;
      case Terrain.GrassClumps: return 27;
      case Terrain.Ice: return 139;
      case Terrain.GridRed: return 173;
      case Terrain.GridYellow: return 54;
      case Terrain.GridBlue: return 157; // It's really purple
      case Terrain.GridGreen: return 101;
      case Terrain.SandDark: return 38;
      case Terrain.SandLight: return 42;
    }

    return 209; // undefined -> pink
  }

  static colourToPalette(colour: number): number {
    switch (colour) {
      case Colour.DarkGreen: return 144;
      case Colour.SalmonPink: return 69;
      case Colour.SaturatedBrown: return 291;
      case Colour.Grey: return 16;
      case Colour.BordeauxRed: return 61;
      case Colour.White: return 21;
      case Colour.DarkBrown: return 34;
      case Colour.IcyBlue: return 201;
      case Colour.BrightRed: return 172;
      case Colour.BrightYellow: return 229;
      case Colour.BrightPurple: return 161;
      case Colour.BrightGreen: return 102;
      case Colour.LightBrown: return 37;
      case Colour.DarkYellow: return 52;
    }

    return Palette.Ix0;
  }
}
