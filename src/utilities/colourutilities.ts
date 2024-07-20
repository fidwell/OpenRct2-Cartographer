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
        return this.colourToPalette(Colour.SaturatedBrown);
      case "crazy_paving":
        return this.colourToPalette(Colour.Beige);
      case "ash":
        return this.colourToPalette(Colour.Black);
      case "tarmac_red":
        return this.colourToPalette(Colour.BordeauxRed);
      case "tarmac_green":
        return this.colourToPalette(Colour.DarkGreen);
      case "tarmac_brown":
        return this.colourToPalette(Colour.Umber);
      case "tarmac":
      case "road":
        return this.colourToPalette(Colour.Grey);
      case "queue_yellow":
        return this.colourToPalette(Colour.Yellow);
      case "queue_red":
        return this.colourToPalette(Colour.BrightRed);
      case "queue_green":
        return this.colourToPalette(Colour.OliveGreen);
      case "queue_blue":
        return this.colourToPalette(Colour.LightBlue);
      case "invisible":
      case "queue_invisible":
        return this.colourToPalette(Colour.Invisible);
      case "tiles_brown":
        return this.colourToPalette(Colour.Beige);
      case "tiles_grey":
        return this.colourToPalette(Colour.Grey);
      case "tiles_green":
        return this.colourToPalette(Colour.OliveGreen);
      case "tiles_red":
        return this.colourToPalette(Colour.CoralPink);
      case "circuitboard":
      case "queue_circuitboard":
        return this.colourToPalette(Colour.DarkBrown);
      case "mosaic":
        return this.colourToPalette(Colour.Beige);
      case "rainbow":
        return this.colourToPalette(Colour.BrightRed);
      case "queue_rainbow":
        return this.colourToPalette(Colour.SaturatedRed);
      case "rocky":
        return this.colourToPalette(Colour.Beige);
      case "pavement":
      case "queue_pavement":
        return this.colourToPalette(Colour.Beige);
      case "medieval":
        return this.colourToPalette(Colour.Beige);
      default: // undefined
        return this.colourToPalette(Colour.BrightPink);
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
