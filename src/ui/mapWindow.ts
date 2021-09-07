import ColourDecider from "../utilities/colourdecider"
import * as Environment from "../environment";

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
        mapColours[x][y] = ColourDecider.getColourAtTile(x, y);
      }
    }

    const mapWidget: CustomWidget = {
      x: margin,
      y: margin + toolbarHeight,
      type: "custom",
      width: mapSize * tileSize + 1,
      height: (1 + mapSize) * tileSize + 1,
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
      width: margin * 2 + tileSize * mapSize + 1,
      height: margin * 2 + tileSize * (mapSize + 1) + toolbarHeight + 1,
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
}
