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

  static water(): number {
    return 237;
  }

  static colourToPalette(colour: number): number {
    // Probably not "exact". I made up this mapping
    switch (colour) {
      case Colour.Black: return 9;
      case Colour.Grey: return 16;
      case Colour.White: return 21;
      case Colour.DarkPurple: return 119;
      case Colour.LightPurple: return 161;
      case Colour.BrightPurple: return 159;
      case Colour.DarkBlue: return 130;
      case Colour.LightBlue: return 136;
      case Colour.IcyBlue: return 201;
      case Colour.Teal: return 232; // Dark water
      case Colour.Aquamarine: return 236; // Light water
      case Colour.SaturatedGreen: return 196;
      case Colour.DarkGreen: return 144;
      case Colour.MossGreen: return 87;
      case Colour.BrightGreen: return 102;
      case Colour.OliveGreen: return 285;
      case Colour.DarkOliveGreen: return 282;
      case Colour.BrightYellow: return 53;
      case Colour.Yellow: return 52;
      case Colour.DarkYellow: return 52;
      case Colour.LightOrange: return 184;
      case Colour.DarkOrange: return 181;
      case Colour.LightBrown: return 37;
      case Colour.SaturatedBrown: return 291;
      case Colour.DarkBrown: return 34;
      case Colour.SalmonPink: return 69;
      case Colour.BordeauxRed: return 61;
      case Colour.SaturatedRed: return 169;
      case Colour.BrightRed: return 172;
      case Colour.DarkPink: return 203;
      case Colour.BrightPink: return 208;
      case Colour.LightPink: return 212;
    }
  }
}