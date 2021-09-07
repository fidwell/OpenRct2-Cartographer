import ColourDecider from "../utilities/colourdecider"
import * as Environment from "../environment";
import Options from "../models/options";

export default class MapWindow {
  onUpdate?: () => void;

  onClose?: () => void;

  private window?: Window;

  private mapColours: number[][] = [];
  private mapSize: number;

  private rotation: number = 0;
  private options: Options = {
    showRides: true,
    showFootpath: true,
    showScenery: false,
    showSurface: true,
    showWater: true
  };

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
      isPressed: this.options.showRides,
      image: 5187, // SPR_RIDE
      onClick: (): void => {
        this.options.showRides = !this.options.showRides;
        this.loadData();
        (window.widgets.filter(w => w.name == "showRides")[0] as ButtonWidget).isPressed = this.options.showRides;
      }
    };

    const btnShowFootpath: ButtonWidget = {
      type: "button",
      x: margin * 2 + buttonSize * 2,
      y: margin + toolbarHeight,
      height: buttonSize,
      width: buttonSize,
      name: "showFootpath",
      border: true,
      tooltip: "Toggle footpath visible",
      isPressed: this.options.showFootpath,
      image: 29357 + 15, // SPR_G2_BUTTON_FOOTPATH
      onClick: (): void => {
        this.options.showFootpath = !this.options.showFootpath;
        this.loadData();
        (window.widgets.filter(w => w.name == "showFootpath")[0] as ButtonWidget).isPressed = this.options.showFootpath;
      }
    };

    const btnShowScenery: ButtonWidget = {
      type: "button",
      x: margin * 2 + buttonSize * 3,
      y: margin + toolbarHeight,
      height: buttonSize,
      width: buttonSize,
      name: "showScenery",
      border: true,
      tooltip: "Toggle scenery visible",
      isPressed: this.options.showScenery,
      image: 5171, // SPR_SCENERY 
      onClick: (): void => {
        this.options.showScenery = !this.options.showScenery;
        this.loadData();
        (window.widgets.filter(w => w.name == "showScenery")[0] as ButtonWidget).isPressed = this.options.showScenery;
      }
    };

    const btnShowWater: ButtonWidget = {
      type: "button",
      x: margin * 2 + buttonSize * 4,
      y: margin + toolbarHeight,
      height: buttonSize,
      width: buttonSize,
      name: "showWater",
      border: true,
      tooltip: "Toggle water visible",
      isPressed: this.options.showWater,
      image: 5467, // SPR_TAB_WATER
      onClick: (): void => {
        this.options.showWater = !this.options.showWater;
        this.loadData();
        (window.widgets.filter(w => w.name == "showWater")[0] as ButtonWidget).isPressed = this.options.showWater;
      }
    };

    const btnShowSurface: ButtonWidget = {
      type: "button",
      x: margin * 2 + buttonSize * 5,
      y: margin + toolbarHeight,
      height: buttonSize,
      width: buttonSize,
      name: "showSurface",
      border: true,
      tooltip: "Toggle surface visible",
      isPressed: this.options.showSurface,
      image: 29357 + 5, // SPR_G2_TAB_LAND
      onClick: (): void => {
        this.options.showSurface = !this.options.showSurface;
        this.loadData();
        (window.widgets.filter(w => w.name == "showSurface")[0] as ButtonWidget).isPressed = this.options.showSurface;
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
        btnShowFootpath,
        btnShowScenery,
        btnShowWater,
        btnShowSurface,
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
        this.mapColours[x][y] = ColourDecider.getColourAtTile(x, y, this.options);
      }
    }
  }
}
