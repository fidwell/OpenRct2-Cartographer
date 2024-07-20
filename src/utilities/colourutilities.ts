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
      case "void": return this.colourToPalette(Colour.Void);
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
    switch (colour) {
      case Colour.Black: return 11;
      case Colour.Grey: return 16;
      case Colour.White: return 21;
      case Colour.DarkPurple: return 119;
      case Colour.LightPurple: return 122;
      case Colour.BrightPurple: return 159;
      case Colour.DarkBlue: return 130;
      case Colour.LightBlue: return 136;
      case Colour.IcyBlue: return 139;
      case Colour.DarkWater: return 196;
      case Colour.LightWater: return 199;
      case Colour.SaturatedGreen: return 96;
      case Colour.DarkGreen: return 148;
      case Colour.MossGreen: return 75;
      case Colour.BrightGreen: return 100;
      case Colour.OliveGreen: return 89;
      case Colour.DarkOliveGreen: return 26;
      case Colour.BrightYellow: return 55;
      case Colour.Yellow: return 52;
      case Colour.DarkYellow: return 48;
      case Colour.LightOrange: return 184;
      case Colour.DarkOrange: return 181;
      case Colour.LightBrown: return 38;
      case Colour.SaturatedBrown: return 35;
      case Colour.DarkBrown: return 218;
      case Colour.SalmonPink: return 112;
      case Colour.BordeauxRed: return 63;
      case Colour.SaturatedRed: return 169;
      case Colour.BrightRed: return 172;
      case Colour.DarkPink: return 203;
      case Colour.BrightPink: return 208;
      case Colour.LightPink: return 69;
      // Extended
      case Colour.ArmyGreen: return 23;
      case Colour.Honeydew: return 30;
      case Colour.Tan: return 42;
      case Colour.Maroon: return 60;
      case Colour.CoralPink: return 67;
      case Colour.ForestGreen: return 72;
      case Colour.Chartreuse: return 78;
      case Colour.HunterGreen: return 85;
      case Colour.Celadon: return 92;
      case Colour.LimeGreen: return 104;
      case Colour.Sepia: return 109;
      case Colour.Peach: return 115;
      case Colour.Periwinkle: return 126;
      case Colour.Viridian: return 144;
      case Colour.SeafoamGreen: return 150;
      case Colour.Violet: return 156;
      case Colour.Lavender: return 163;
      case Colour.PastelOrange: return 187;
      case Colour.DeepWater: return 192;
      case Colour.PastelPink: return 211;
      case Colour.Umber: return 215;
      case Colour.Beige: return 223;
      case Colour.Invisible: return 0;
      case Colour.Void:
      default: return 10; // undefined -> void
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
