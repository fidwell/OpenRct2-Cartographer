import { Colour } from "../enums/colour";

// See ImageImporter.h for colour indexes

export default class ColourUtilities {
  static surfaceToPalette(surface: number): number {
    const surfaceObject = objectManager.getObject("terrain_surface", surface);
    switch (surfaceObject.identifier.split(".")[2]) {
      case "grass": return 72;
      case "grass_clumps": return 23;
      case "dirt": return 218;
      case "ice": return 139;
      case "rock": return 13;
      case "sand": return 44;
      case "martian": return 109;
      case "sand_brown": return 221;
      case "sand_red": return 111;

      // rct1
      case "rust": return 220;
      case "wood": return 47;
      case "roof_grey": return 17;
      case "roof_red": return 176;
      case "chequerboard": return 16;
      case "grid_green": return 101;
      case "grid_purple": return 157;
      case "grid_red": return 173;
      case "grid_yellow": return 54;

      // open
      case "void": return 4;
      case "wildflowers": return 74;

      default: return 209; // undefined -> pink
    }
  }

  static footpathToPalette(footpath: number): number {
    const pathType = objectManager.getObject("footpath_surface", footpath);
    switch (pathType.identifier.split(".")[2]) {
      case "dirt":
        return 216;
      case "crazy_paving":
        return 223;
      case "ash":
        return 10;
      case "tarmac_red":
        return 62;
      case "tarmac_green":
        return 75;
      case "tarmac_brown":
        return 34;
      case "tarmac":
      case "road":
        return 15;
      case "queue_yellow":
        return 54;
      case "queue_red":
        return 173;
      case "queue_green":
        return 100;
      case "queue_blue":
        return 137;
      case "invisible":
      case "queue_invisible":
        return 0;
      default:
        return 209; // undefined -> pink
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
      // Extended
      case Colour.ArmyGreen: return 14;
      case Colour.Honeydew: return 21;
      case Colour.Tan: return 31;
      case Colour.Maroon: return 50;
      case Colour.CoralPink: return 58;
      case Colour.ForestGreen: return 62;
      case Colour.Chartreuse: return 69;
      case Colour.HunterGreen: return 15;
      case Colour.Celadon: return 80;
      case Colour.LimeGreen: return 94;
      case Colour.Sepia: return 98;
      case Colour.Peach: return 106;
      case Colour.Periwinkle: return 118;
      case Colour.Viridian: return 133;
      case Colour.SeafoamGreen: return 142;
      case Colour.Violet: return 153;
      case Colour.Lavender: return 200;
      case Colour.PastelOrange: return 177;
      case Colour.DeepWater: return 181;
      case Colour.PastelPink: return 203;
      case Colour.Umber: return 205;
      case Colour.Beige: return 213;
      case Colour.Invisible: return 0;
      case Colour.Void: return 0;
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
