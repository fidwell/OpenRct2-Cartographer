import { Colour } from "../enums/colour";
import { Terrain } from "../enums/terrain";

// See ImageImporter.h for colour indexes

export default class ColourUtilities {
  static surfaceToPalette(surface: number): number {
    switch (surface) {
      case Terrain.Grass: return 72;
      case Terrain.Sand: return 42;
      case Terrain.Dirt: return 218;
      case Terrain.Rock: return 13;
      case Terrain.Martian: return 109;
      case Terrain.Checkerboard: return 20;
      case Terrain.GrassClumps: return 23;
      case Terrain.Ice: return 139;
      case Terrain.GridRed: return 173;
      case Terrain.GridYellow: return 54;
      case Terrain.GridBlue: return 157; // It's really purple
      case Terrain.GridGreen: return 101;
      case Terrain.SandDark: return 109;
      case Terrain.SandLight: return 220;
      default: return 209; // undefined -> pink
    }
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
      case Colour.Teal: return 194; // Dark and light water colours cause animation even if it's scenery
      case Colour.Aquamarine: return 200; // 236;
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
      default: return 9; // undefined -> black
    }
  }

  static gradientPaletteValue(value: number, maximum: number): number {
    if (value > 15) {
      // Too many peeps! Warning color
      return 209;
    }

    const proportion = value / maximum;
    const index = Math.floor(proportion * this.peepColourGradient.length);
    return this.peepColourGradient[index];
  }

  static peepColourGradient: number[] = [
    21, // white
    57, // lightest yellow
    56,
    55,
    54,
    53,
    52,
    51,
    50, // yellow
    186, // orange
    185,
    184,
    173 // red
  ];
}
