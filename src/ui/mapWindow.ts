import ColourDecider from "../utilities/colourdecider";
import * as Environment from "../environment";
import Options from "../models/options";

export default class MapWindow {
  onUpdate?: () => void;

  onClose?: () => void;

  private window?: Window;

  // Window-building constants
  private margin: number = 10;

  private toolbarHeight: number = 10;

  private buttonSize: number = 26;

  // Map information
  private mapColours: number[][] = [];

  private mapSize: number;

  // Display parameters
  private rotation: number = 0;

  private tileSize: number = 4;

  private options: Options = {
    showRides: true,
    showFootpath: true,
    showScenery: false,
    showSurface: true,
    showWater: true
  };

  private createWindow(): Window {
    this.mapSize = map.size.x - 2; // Size is stored as 2 bigger than it really is for some reason

    this.loadData();

    const btnScaleDown: ButtonWidget = {
      type: "button",
      x: this.margin,
      y: this.margin + this.toolbarHeight,
      height: this.buttonSize,
      width: this.buttonSize,
      name: "scaleDown",
      border: true,
      tooltip: "Scale down",
      image: 29357 + 9, // SPR_G2_ZOOM_OUT
      onClick: (): void => {
        if (this.tileSize > 1) {
          this.tileSize /= 2;
          this.changeSize();
        }
      }
    };

    const btnScaleUp: ButtonWidget = {
      type: "button",
      x: this.margin + this.buttonSize,
      y: this.margin + this.toolbarHeight,
      height: this.buttonSize,
      width: this.buttonSize,
      name: "scaleUp",
      border: true,
      tooltip: "Scale up",
      image: 29357 + 7, // SPR_G2_ZOOM_IN
      onClick: (): void => {
        if (this.tileSize < 16) {
          this.tileSize *= 2;
          this.changeSize();
        }
      }
    };

    const btnRotate: ButtonWidget = {
      type: "button",
      x: this.margin + this.buttonSize * 2,
      y: this.margin + this.toolbarHeight,
      height: this.buttonSize,
      width: this.buttonSize,
      name: "rotate",
      border: true,
      tooltip: "Rotate view",
      image: 5169, // SPR_ROTATE_ARROW
      onClick: (): void => {
        this.rotation = (this.rotation + 1) % 4;
      }
    };

    const btnShowSurface: ButtonWidget = {
      type: "button",
      x: this.margin * 2 + this.buttonSize * 3,
      y: this.margin + this.toolbarHeight,
      height: this.buttonSize,
      width: this.buttonSize,
      name: "showSurface",
      border: true,
      tooltip: "Toggle surface visible",
      isPressed: this.options.showSurface,
      image: 29357 + 5, // SPR_G2_TAB_LAND
      onClick: (): void => {
        this.options.showSurface = !this.options.showSurface;
        this.loadData();
        (window.widgets.filter((w) => w.name === "showSurface")[0] as ButtonWidget).isPressed = this.options.showSurface;
      }
    };

    const btnShowWater: ButtonWidget = {
      type: "button",
      x: this.margin * 2 + this.buttonSize * 4,
      y: this.margin + this.toolbarHeight,
      height: this.buttonSize,
      width: this.buttonSize,
      name: "showWater",
      border: true,
      tooltip: "Toggle water visible",
      isPressed: this.options.showWater,
      image: 5467, // SPR_TAB_WATER
      onClick: (): void => {
        this.options.showWater = !this.options.showWater;
        this.loadData();
        (window.widgets.filter((w) => w.name === "showWater")[0] as ButtonWidget).isPressed = this.options.showWater;
      }
    };

    const btnShowScenery: ButtonWidget = {
      type: "button",
      x: this.margin * 2 + this.buttonSize * 5,
      y: this.margin + this.toolbarHeight,
      height: this.buttonSize,
      width: this.buttonSize,
      name: "showScenery",
      border: true,
      tooltip: "Toggle scenery visible",
      isPressed: this.options.showScenery,
      image: 5171, // SPR_SCENERY
      onClick: (): void => {
        this.options.showScenery = !this.options.showScenery;
        this.loadData();
        (window.widgets.filter((w) => w.name === "showScenery")[0] as ButtonWidget).isPressed = this.options.showScenery;
      }
    };

    const btnShowFootpath: ButtonWidget = {
      type: "button",
      x: this.margin * 2 + this.buttonSize * 6,
      y: this.margin + this.toolbarHeight,
      height: this.buttonSize,
      width: this.buttonSize,
      name: "showFootpath",
      border: true,
      tooltip: "Toggle footpath visible",
      isPressed: this.options.showFootpath,
      image: 29357 + 15, // SPR_G2_BUTTON_FOOTPATH
      onClick: (): void => {
        this.options.showFootpath = !this.options.showFootpath;
        this.loadData();
        (window.widgets.filter((w) => w.name === "showFootpath")[0] as ButtonWidget).isPressed = this.options.showFootpath;
      }
    };

    const btnShowRides: ButtonWidget = {
      type: "button",
      x: this.margin * 2 + this.buttonSize * 7,
      y: this.margin + this.toolbarHeight,
      height: this.buttonSize,
      width: this.buttonSize,
      name: "showRides",
      border: true,
      tooltip: "Toggle rides visible",
      isPressed: this.options.showRides,
      image: 5187, // SPR_RIDE
      onClick: (): void => {
        this.options.showRides = !this.options.showRides;
        this.loadData();
        (window.widgets.filter((w) => w.name === "showRides")[0] as ButtonWidget).isPressed = this.options.showRides;
      }
    };

    const mapWidget: CustomWidget = {
      x: this.margin,
      y: this.toolbarHeight + this.buttonSize + this.margin,
      type: "custom",
      width: 10000, //this.mapSize * this.tileSize + 1,
      height: 10000, //(1 + this.mapSize) * this.tileSize + 1,
      name: "mapWidget",
      onDraw: (g: GraphicsContext) => {
        g.fill = 1; // Yes fill
        g.stroke = 0; // No stroke

        for (let x = 0; x < this.mapSize; x += 1) {
          for (let y = 0; y < this.mapSize; y += 1) {
            let colour: number;
            switch (this.rotation) {
              case 1: colour = this.mapColours[-y + this.mapSize - 1][x]; break;
              case 2: colour = this.mapColours[-x + this.mapSize - 1][-y + this.mapSize - 1]; break;
              case 3: colour = this.mapColours[y][-x + this.mapSize - 1]; break;
              default: colour = this.mapColours[x][y]; break;
            }

            g.colour = colour;
            g.fill = colour;
            g.rect(x * this.tileSize, (this.mapSize - y) * this.tileSize, this.tileSize, this.tileSize);
          }
        }
      }
    };

    const window = ui.openWindow({
      classification: Environment.namespace,
      title: `${Environment.pluginName} (v${Environment.pluginVersion})`,
      width: this.margin * 2 + this.tileSize * this.mapSize,
      height: this.toolbarHeight + this.buttonSize + (this.mapSize + 1) * this.tileSize + this.margin * 2,
      maxHeight: 10000,
      maxWidth: 10000,
      minHeight: 0,
      minWidth: btnShowRides.x + btnShowRides.width + this.margin,
      widgets: [
        btnScaleDown,
        btnScaleUp,
        btnRotate,

        btnShowSurface,
        btnShowWater,
        btnShowScenery,
        btnShowFootpath,
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
    for (let x = 0; x < this.mapSize; x += 1) {
      this.mapColours[x] = [];
    }

    for (let x = 0; x < this.mapSize; x += 1) {
      for (let y = 0; y < this.mapSize; y += 1) {
        this.mapColours[x][y] = ColourDecider.getColourAtTile(x, y, this.options);
      }
    }
  }

  changeSize(): void {
    if (this.window) {
      this.window.width = this.margin * 2 + this.tileSize * this.mapSize;
      this.window.height = this.toolbarHeight + this.buttonSize + (this.mapSize + 1) * this.tileSize + this.margin * 2;
    }
  }
}
