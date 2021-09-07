import ColourUtilities from "../utilities/colourutilities";
import * as Environment from "../environment";
import * as Log from "../utilities/logger";

export default class MapWindow {
  onUpdate?: () => void;

  onClose?: () => void;

  private window?: Window;

  private createWindow(): Window {
    const mapSize = map.size.x - 2; // Size is stored as 2 bigger than it really is for some reason
    const tileSize: number = 6;
    const margin: number = 10;
    const toolbarHeight: number = 10;

    const mapColours: number[][] = [];
    for (let x = 0; x < mapSize; x++) {
      mapColours[x] = [];
    }

    for (let x = 0; x < mapSize; x++) {
      for (let y = 0; y < mapSize; y++) {
        mapColours[x][y] = this.getColourAtTile(x, y);
      }
    }

    const mapWidget: CustomWidget = {
      x: margin,
      y: margin + toolbarHeight,
      type: "custom",
      width: mapSize * tileSize,
      height: mapSize * tileSize,
      name: "mapWidget",
      onDraw: (g: GraphicsContext) => {
        g.fill = 1; // Yes fill
        g.stroke = 0; // No stroke

        for (let x = 0; x < mapSize; x++) {
          for (let y = 0; y < mapSize; y++) {
            const colour = mapColours[x][y];
            g.colour = colour;
            g.fill = colour;
            g.rect(x * tileSize, (mapSize - y) * tileSize, tileSize, tileSize);
          }
        }
      }
    };

    const window = ui.openWindow({
      classification: Environment.namespace,
      title: `${Environment.pluginName} (v${Environment.pluginVersion})`,
      width: margin * 2 + tileSize * mapSize,
      height: margin * 2 + tileSize * mapSize + toolbarHeight,
      widgets: [mapWidget],
      onUpdate: () => {
        if (this.onUpdate) {
          this.onUpdate();
        }
      },
      onClose: () => {
        if (this.onClose) {
          this.onClose();
        }
      }
    });

    return window;
  }

  show(): void {
    if (this.window) {
      this.window.bringToFront();
    } else {
      this.window = this.createWindow();
    }
  }

  static close(): void {
    ui.closeWindows(Environment.namespace);
  }

  getColourAtTile(x: number, y: number): number {
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
