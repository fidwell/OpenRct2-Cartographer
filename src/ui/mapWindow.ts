import ColourDecider from "../utilities/colourdecider";
import * as Environment from "../environment";
import Graphics from "./graphics";
import * as Logger from "../utilities/logger";
import Options from "../models/options";

export default class MapWindow {
  onUpdate?: () => void;

  onClose?: () => void;

  private window?: Window;

  // Window-building constants
  private margin: number = 10;

  private toolbarHeight: number = 10;

  private buttonSize: number = 26;

  private mapImageId: number = 0;

  // Map information
  private mapColours: number[][] = [];

  private mapSize: number;

  // Display parameters
  private rotation: number = 0;

  private tileSize: number = 2;

  private options: Options = {
    showRides: true,
    showFootpath: true,
    showScenery: false,
    showSurface: true,
    showWater: true
  };

  private createWindow(): Window {
    this.mapSize = map.size.x - 2; // Size is stored as 2 bigger than it really is for some reason

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
          this.tileSize -= 1;
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
          this.tileSize += 1;
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
        this.draw();
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
        this.draw();
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
        this.draw();
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
        this.draw();
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
        this.draw();
        (window.widgets.filter((w) => w.name === "showRides")[0] as ButtonWidget).isPressed = this.options.showRides;
      }
    };

    const mapWidgetSize = this.tileSize * this.mapSize;

    const mapWidget: ButtonWidget = {
      x: this.margin,
      y: btnScaleDown.y + btnScaleDown.height + this.margin,
      type: "button",
      width: mapWidgetSize,
      height: mapWidgetSize,
      name: "mapWidget",
      image: this.mapImageId
    };

    const window = ui.openWindow({
      classification: Environment.namespace,
      title: `${Environment.pluginName} (v${Environment.pluginVersion})`,
      width: this.margin * 2 + this.tileSize * this.mapSize,
      height: mapWidget.y + mapWidget.height + this.margin,
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
      this.initializeImage();
      this.loadData();
      this.draw();
    }
  }

  static close(): void {
    ui.closeWindows(Environment.namespace);
  }

  loadData(): void {
    const start = new Date().getTime();
    this.mapColours = [];
    for (let x = 0; x < this.mapSize; x += 1) {
      this.mapColours[x] = [];
    }

    for (let x = 0; x < this.mapSize; x += 1) {
      for (let y = 0; y < this.mapSize; y += 1) {
        this.mapColours[x][y] = ColourDecider.getColourAtTile(x, y, this.options);
      }
    }
    const finish = new Date().getTime();
    const elapsed = finish - start;
    Logger.debug(`LoadData took ${elapsed} ms`);
  }

  changeSize(): void {
    if (!this.window) {
      return;
    }

    const mapWidget = <ButtonWidget>this.window.findWidget("mapWidget");
    const mapWidgetSize = this.tileSize * this.mapSize;
    mapWidget.width = mapWidgetSize;
    mapWidget.height = mapWidgetSize;

    this.window.width = mapWidget.x + mapWidget.width + this.margin;
    this.window.height = mapWidget.y + mapWidget.height + this.margin;

    Logger.debug(`Map size changed to ${this.tileSize}`);
    this.draw();
  }

  initializeImage() {
    this.mapImageId = Graphics.allocateImage(<RawPixelData>{
      type: "raw",
      height: this.mapSize,
      width: this.mapSize,
      data: new Uint8Array(0)
    });

    var mapWidget = <ButtonWidget>this.window.findWidget("mapWidget");
    mapWidget.width = this.mapSize * this.tileSize;
    mapWidget.height = this.mapSize * this.tileSize;
    mapWidget.image = this.mapImageId;
  }

  draw() {
    const scaledMap = MapWindow.scaleMap(this.mapColours, this.tileSize);
    const rotatedMap = MapWindow.rotateMap(scaledMap, this.rotation);

    const start = new Date().getTime();
    Logger.debug(`Reducing map...`);

    const flattenedColours: number[] = [];
    for (let i = 0; i < rotatedMap.length; i++) {
      for (let j = 0; j < rotatedMap[i].length; j++) {
        flattenedColours.push(rotatedMap[i][j]);
      }
    }

    const finish = new Date().getTime();
    const elapsed = finish - start;
    Logger.debug(`Map reducing took ${elapsed} ms`);

    Graphics.setPixelData(this.mapImageId, <RawPixelData>{
      type: "raw",
      height: this.mapSize * this.tileSize,
      width: this.mapSize * this.tileSize,
      data: new Uint8Array(flattenedColours)
    });
  }

  static rotateMap(input: number[][], rotation: number): number[][] {
    const start = new Date().getTime();
    Logger.debug(`Rotating map...`);
    const returnValue: number[][] = [];
    for (let x = 0; x < input.length; x += 1) {
      returnValue[x] = [];
    }

    for (let x = 0; x < input.length; x += 1) {
      for (let y = 0; y < input.length; y += 1) {
        let colour: number;
        switch (rotation) {
          case 1: colour = input[-y + input.length - 1][x]; break;
          case 2: colour = input[-x + input.length - 1][-y + input.length - 1]; break;
          case 3: colour = input[y][-x + input.length - 1]; break;
          default: colour = input[x][y]; break;
        }
        returnValue[x][y] = colour;
      }
    }

    const finish = new Date().getTime();
    const elapsed = finish - start;
    Logger.debug(`RotateMap took ${elapsed} ms`);

    return returnValue;
  }

  static scaleMap(mapData: number[][], tileSize: number): number[][] {
    const start = new Date().getTime();
    const newMapSize = mapData.length * tileSize;
    Logger.debug(`Scaling map to ${newMapSize} (${tileSize}x)...`);

    const returnValue: number[][] = [];
    for (let x = 0; x < newMapSize; x += 1) {
      returnValue[x] = [];
    }

    for (let x = 0; x < mapData.length; x += 1) {
      for (let y = 0; y < mapData.length; y += 1) {
        for (let cx = 0; cx < tileSize; cx += 1) {
          for (let cy = 0; cy < tileSize; cy += 1) {
            returnValue[x * tileSize + cx][y * tileSize + cy] = mapData[x][y];
          }
        }
      }
    }

    const finish = new Date().getTime();
    const elapsed = finish - start;
    Logger.debug(`ScaleMap took ${elapsed} ms`);
    return returnValue;
  }
}
