import ColourDecider from "../utilities/colourdecider"
import * as Environment from "../environment";
import * as Log from "../utilities/logger";

export default class MapWindow {
  onUpdate?: () => void;

  onClose?: () => void;

  private window?: Window;
  private rotation: number = 0;

  private createWindow(): Window {
    const mapSize = map.size.x - 2; // Size is stored as 2 bigger than it really is for some reason
    const tileSize: number = 4;
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

    const buttonSize: number = 26;

    const btnRotate: ButtonWidget = {
      type: "button",
      x: margin,
      y: margin + toolbarHeight,
      height: buttonSize,
      width: buttonSize,
      name: "rotate",
      image: 5169, // SPR_ROTATE_ARROW
      onClick: (): void => {
        this.rotation = (this.rotation + 1) % 4;
      }
    };

    const mapWidget: CustomWidget = {
      x: margin,
      y: toolbarHeight + buttonSize + margin,
      type: "custom",
      width: mapSize * tileSize + 1,
      height: (1 + mapSize) * tileSize + 1,
      name: "mapWidget",
      onDraw: (g: GraphicsContext) => {
        g.fill = 1; // Yes fill
        g.stroke = 0; // No stroke

        for (let x = 0; x < mapSize; x++) {
          for (let y = 0; y < mapSize; y++) {
            let colour: number;
            switch (this.rotation) {
              case 1: colour = mapColours[-y + mapSize - 1][x]; break;
              case 2: colour = mapColours[-x + mapSize - 1][-y + mapSize - 1]; break;
              case 3: colour = mapColours[y][-x + mapSize - 1]; break;
              default: colour = mapColours[x][y]; break;
            }

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
      height: mapWidget.y + mapWidget.height + margin,
      widgets: [
        btnRotate,
        mapWidget
      ],
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
