import ColourDecider from "../utilities/colourdecider"
import * as Environment from "../environment";
import * as Log from "../utilities/logger";

export default class MapWindow {
  onUpdate?: () => void;

  onClose?: () => void;

  private window?: Window;

  private mapColours: number[][] = [];
  private mapSize: number;

  private rotation: number = 0;
  private showRides: boolean = true;

  private createWindow(): Window {
    this.mapSize = map.size.x - 2; // Size is stored as 2 bigger than it really is for some reason
    const tileSize: number = 4;
    const margin: number = 10;
    const toolbarHeight: number = 10;

    this.loadData();

    const buttonSize: number = 26;

    const btnRotate: ButtonWidget = {
      type: "button",
      x: margin,
      y: margin + toolbarHeight,
      height: buttonSize,
      width: buttonSize,
      name: "rotate",
      border: true,
      tooltip: "Rotate view",
      image: 5169, // SPR_ROTATE_ARROW
      onClick: (): void => {
        this.rotation = (this.rotation + 1) % 4;
      }
    };

    const btnShowRides: ButtonWidget = {
      type: "button",
      x: margin * 2 + buttonSize,
      y: margin + toolbarHeight,
      height: buttonSize,
      width: buttonSize,
      name: "showRides",
      border: true,
      tooltip: "Toggle rides visible",
      isPressed: this.showRides,
      image: 5187, // SPR_RIDE
      onClick: (): void => {
        this.showRides = !this.showRides;
        this.loadData();
        (window.widgets.filter(w => w.name == "showRides")[0] as ButtonWidget).isPressed = this.showRides;
      }
    };

    const mapWidget: CustomWidget = {
      x: margin,
      y: toolbarHeight + buttonSize + margin,
      type: "custom",
      width: this.mapSize * tileSize + 1,
      height: (1 + this.mapSize) * tileSize + 1,
      name: "mapWidget",
      onDraw: (g: GraphicsContext) => {
        g.fill = 1; // Yes fill
        g.stroke = 0; // No stroke

        for (let x = 0; x < this.mapSize; x++) {
          for (let y = 0; y < this.mapSize; y++) {
            let colour: number;
            switch (this.rotation) {
              case 1: colour = this.mapColours[-y + this.mapSize - 1][x]; break;
              case 2: colour = this.mapColours[-x + this.mapSize - 1][-y + this.mapSize - 1]; break;
              case 3: colour = this.mapColours[y][-x + this.mapSize - 1]; break;
              default: colour = this.mapColours[x][y]; break;
            }

            g.colour = colour;
            g.fill = colour;
            g.rect(x * tileSize, (this.mapSize - y) * tileSize, tileSize, tileSize);
          }
        }
      }
    };

    const window = ui.openWindow({
      classification: Environment.namespace,
      title: `${Environment.pluginName} (v${Environment.pluginVersion})`,
      width: margin * 2 + tileSize * this.mapSize + 1,
      height: mapWidget.y + mapWidget.height + margin,
      widgets: [
        btnRotate,
        btnShowRides,
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

  loadData(): void {
    this.mapColours = [];
    for (let x = 0; x < this.mapSize; x++) {
      this.mapColours[x] = [];
    }

    for (let x = 0; x < this.mapSize; x++) {
      for (let y = 0; y < this.mapSize; y++) {
        this.mapColours[x][y] = ColourDecider.getColourAtTile(x, y, this.showRides);
      }
    }
  }
}
