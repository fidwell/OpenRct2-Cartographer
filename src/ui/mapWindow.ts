import * as Environment from "../environment";
import Options from "../models/options";
import ColourDecider from "../utilities/colourdecider";
import * as Logger from "../utilities/logger";
import PeepFinder from "../utilities/peepfinder";
import Graphics from "./graphics";

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

  private mapWidth: number = 0;

  private mapHeight: number = 0;

  private peepFinder: PeepFinder = new PeepFinder();

  // Display parameters
  private rotation: number = (ui.mainViewport.rotation + 2) % 4;

  private tileSize: number = 2;

  private options: Options = {
    showOpenRides: true,
    showTestingRides: true,
    showClosedRides: true,
    showFootpath: true,
    showScenery: false,
    showSurface: true,
    showWater: true,
    showPeeps: false
  };

  private createWindow(): Window {
    // Size is stored as 2 bigger than it really is to have a one-tile margin
    this.mapWidth = map.size.x - 2;
    this.mapHeight = map.size.y - 2;

    const btnScaleDown: ButtonDesc = {
      type: "button",
      x: this.margin,
      y: this.margin + this.toolbarHeight,
      height: this.buttonSize,
      width: this.buttonSize,
      name: "scaleDown",
      border: true,
      tooltip: "Scale down",
      image: context.getIcon("zoom_out"),
      onClick: (): void => {
        if (this.tileSize > 1) {
          this.tileSize -= 1;
          this.changeSize();
        }
      }
    };

    const btnScaleUp: ButtonDesc = {
      type: "button",
      x: this.margin + this.buttonSize,
      y: this.margin + this.toolbarHeight,
      height: this.buttonSize,
      width: this.buttonSize,
      name: "scaleUp",
      border: true,
      tooltip: "Scale up",
      image: context.getIcon("zoom_in"),
      onClick: (): void => {
        if (this.tileSize < 16) {
          this.tileSize += 1;
          this.changeSize();
        }
      }
    };

    const btnRotate: ButtonDesc = {
      type: "button",
      x: this.margin + this.buttonSize * 2,
      y: this.margin + this.toolbarHeight,
      height: this.buttonSize,
      width: this.buttonSize,
      name: "rotate",
      border: true,
      tooltip: "Rotate view",
      image: context.getIcon("rotate_arrow"),
      onClick: (): void => {
        this.rotation = (this.rotation + 1) % 4;
        this.changeSize();
      }
    };

    const btnShowSurface: ButtonDesc = {
      type: "button",
      x: this.margin * 2 + this.buttonSize * 3,
      y: this.margin + this.toolbarHeight,
      height: this.buttonSize,
      width: this.buttonSize,
      name: "showSurface",
      border: true,
      tooltip: "Toggle surface visible",
      isPressed: this.options.showSurface,
      image: context.getIcon("map_gen_land"),
      onClick: (): void => {
        this.options.showSurface = !this.options.showSurface;
        (window.widgets.filter((w) => w.name === "showSurface")[0] as ButtonWidget).isPressed = this.options.showSurface;
        this.loadData();
        this.draw();
      }
    };

    const btnShowWater: ButtonDesc = {
      type: "button",
      x: this.margin * 2 + this.buttonSize * 4,
      y: this.margin + this.toolbarHeight,
      height: this.buttonSize,
      width: this.buttonSize,
      name: "showWater",
      border: true,
      tooltip: "Toggle water visible",
      isPressed: this.options.showWater,
      image: context.getIcon("water"),
      onClick: (): void => {
        this.options.showWater = !this.options.showWater;
        (window.widgets.filter((w) => w.name === "showWater")[0] as ButtonWidget).isPressed = this.options.showWater;
        this.loadData();
        this.draw();
      }
    };

    const btnShowScenery: ButtonDesc = {
      type: "button",
      x: this.margin * 2 + this.buttonSize * 5,
      y: this.margin + this.toolbarHeight,
      height: this.buttonSize,
      width: this.buttonSize,
      name: "showScenery",
      border: true,
      tooltip: "Toggle scenery visible",
      isPressed: this.options.showScenery,
      image: context.getIcon("scenery"),
      onClick: (): void => {
        this.options.showScenery = !this.options.showScenery;
        (window.widgets.filter((w) => w.name === "showScenery")[0] as ButtonDesc).isPressed = this.options.showScenery;
        this.loadData();
        this.draw();
      }
    };

    const btnShowFootpath: ButtonDesc = {
      type: "button",
      x: this.margin * 2 + this.buttonSize * 6,
      y: this.margin + this.toolbarHeight,
      height: this.buttonSize,
      width: this.buttonSize,
      name: "showFootpath",
      border: true,
      tooltip: "Toggle footpath visible",
      isPressed: this.options.showFootpath,
      image: context.getIcon("paths"),
      onClick: (): void => {
        this.options.showFootpath = !this.options.showFootpath;
        (window.widgets.filter((w) => w.name === "showFootpath")[0] as ButtonDesc).isPressed = this.options.showFootpath;
        this.loadData();
        this.draw();
      }
    };

    const btnShowOpenRides: ButtonDesc = {
      type: "button",
      x: this.margin * 2 + this.buttonSize * 7,
      y: this.margin + this.toolbarHeight,
      height: this.buttonSize,
      width: this.buttonSize,
      name: "showOpenRides",
      border: true,
      tooltip: "Toggle open rides visible",
      isPressed: this.options.showOpenRides,
      image: context.getIcon("open"),
      onClick: (): void => {
        this.options.showOpenRides = !this.options.showOpenRides;
        (window.widgets.filter((w) => w.name === "showOpenRides")[0] as ButtonDesc).isPressed = this.options.showOpenRides;
        this.loadData();
        this.draw();
      }
    };

    const btnShowTestingRides: ButtonDesc = {
      type: "button",
      x: this.margin * 2 + this.buttonSize * 8,
      y: this.margin + this.toolbarHeight,
      height: this.buttonSize,
      width: this.buttonSize,
      name: "showTestingRides",
      border: true,
      tooltip: "Toggle testing rides visible",
      isPressed: this.options.showTestingRides,
      image: context.getIcon("testing"),
      onClick: (): void => {
        this.options.showTestingRides = !this.options.showTestingRides;
        (window.widgets.filter((w) => w.name === "showTestingRides")[0] as ButtonDesc).isPressed = this.options.showTestingRides;
        this.loadData();
        this.draw();
      }
    };

    const btnShowClosedRides: ButtonDesc = {
      type: "button",
      x: this.margin * 2 + this.buttonSize * 9,
      y: this.margin + this.toolbarHeight,
      height: this.buttonSize,
      width: this.buttonSize,
      name: "showClosedRides",
      border: true,
      tooltip: "Toggle closed rides visible",
      isPressed: this.options.showClosedRides,
      image: context.getIcon("closed"),
      onClick: (): void => {
        this.options.showClosedRides = !this.options.showClosedRides;
        (window.widgets.filter((w) => w.name === "showClosedRides")[0] as ButtonDesc).isPressed = this.options.showClosedRides;
        this.loadData();
        this.draw();
      }
    };

    const btnShowPeeps: ButtonDesc = {
      type: "button",
      x: this.margin * 3 + this.buttonSize * 10,
      y: this.margin + this.toolbarHeight,
      height: this.buttonSize,
      width: this.buttonSize,
      name: "showPeeps",
      border: true,
      tooltip: "Toggle peep heatmap",
      isPressed: this.options.showPeeps,
      image: context.getIcon("guests"),
      onClick: (): void => {
        this.options.showPeeps = !this.options.showPeeps;
        (window.widgets.filter((w) => w.name === "showPeeps")[0] as ButtonDesc).isPressed = this.options.showPeeps;
        this.loadData();
        this.draw();
      }
    };

    const mapWidgetWidth = this.tileSize * this.mapWidth;
    const mapWidgetHeight = this.tileSize * this.mapHeight;

    const mapWidget: ButtonDesc = {
      x: this.margin,
      y: btnScaleDown.y + btnScaleDown.height + this.margin,
      type: "button",
      width: mapWidgetWidth,
      height: mapWidgetHeight,
      name: "mapWidget",
      image: this.mapImageId
    };

    const window = ui.openWindow({
      classification: Environment.namespace,
      title: `${Environment.pluginName} (v${Environment.pluginVersion})`,
      width: this.margin * 2 + mapWidgetWidth,
      height: mapWidget.y + mapWidget.height + this.margin,
      minHeight: mapWidget.y + mapWidget.height + this.margin,
      minWidth: btnShowPeeps.x + btnShowPeeps.width + this.margin,
      widgets: [
        btnScaleDown,
        btnScaleUp,
        btnRotate,

        btnShowSurface,
        btnShowWater,
        btnShowScenery,
        btnShowFootpath,
        btnShowOpenRides,
        btnShowTestingRides,
        btnShowClosedRides,
        btnShowPeeps,

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
      this.changeSize();
      this.draw();
    }
  }

  static close(): void {
    ui.closeWindows(Environment.namespace);
  }

  loadData(): void {
    const start = new Date().getTime();

    if (this.options.showPeeps) {
      this.peepFinder.loadPeepData(this.mapWidth, this.mapHeight);
    }

    this.mapColours = [];
    for (let x = 0; x < this.mapWidth; x += 1) {
      this.mapColours[x] = [];
    }

    for (let x = 0; x < this.mapWidth; x += 1) {
      for (let y = 0; y < this.mapHeight; y += 1) {
        // Need to "mirror" the input so it actually looks correct
        this.mapColours[x][this.mapHeight - 1 - y] = ColourDecider.getColourAtTile(x, y, this.options, this.peepFinder);
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
    const isRotated = this.rotation % 2 !== 0;
    const mapWidgetWidth = this.tileSize * (isRotated ? this.mapHeight : this.mapWidth);
    const mapWidgetHeight = this.tileSize * (isRotated ? this.mapWidth : this.mapHeight);
    mapWidget.width = mapWidgetWidth;
    mapWidget.height = mapWidgetHeight;

    const btnShowPeeps = (this.window.widgets.filter((w) => w.name === "showPeeps")[0] as ButtonWidget);
    this.window.minWidth = Math.max(mapWidget.x + mapWidgetWidth + this.margin, btnShowPeeps.x + btnShowPeeps.width + this.margin);
    this.window.minHeight = mapWidget.y + mapWidgetHeight + this.margin;

    this.window.width = this.window.minWidth;
    this.window.height = this.window.minHeight;

    Logger.debug(`Map size changed to ${this.tileSize}`);
    this.draw();
  }

  initializeImage() {
    this.mapImageId = Graphics.allocateImage(<RawPixelData>{
      type: "raw",
      height: this.mapHeight,
      width: this.mapWidth,
      data: new Uint8Array(0)
    }) ?? 0;

    if (this.window !== undefined) {
      const mapWidget = <ButtonWidget>this.window.findWidget("mapWidget");
      const isRotated = this.rotation % 2 !== 0;
      mapWidget.width = this.tileSize * (isRotated ? this.mapHeight : this.mapWidth);
      mapWidget.height = this.tileSize * (isRotated ? this.mapWidth : this.mapHeight);
      mapWidget.image = this.mapImageId ?? 0;
    }
  }

  draw() {
    const rotatedMap = MapWindow.rotateMap(this.mapColours, this.rotation);
    const scaledMap = MapWindow.scaleMap(rotatedMap, this.tileSize);
    const finalMap = scaledMap;

    const start = new Date().getTime();
    Logger.debug("Reducing map...");

    const flattenedColours: number[] = [];
    for (let y = 0; y < finalMap[0].length; y += 1) {
      for (let x = 0; x < finalMap.length; x += 1) {
        flattenedColours.push(finalMap[x][y]);
      }
    }

    const finish = new Date().getTime();
    const elapsed = finish - start;
    Logger.debug(`Map reducing took ${elapsed} ms`);

    Graphics.setPixelData(this.mapImageId, <RawPixelData>{
      type: "raw",
      height: finalMap[0].length,
      width: finalMap.length,
      data: new Uint8Array(flattenedColours)
    });
  }

  static rotateMap(input: number[][], rotation: number): number[][] {
    const start = new Date().getTime();
    Logger.debug("Rotating map...");

    var numRows = input.length;
    var numCols = input[0].length;
    var returnValue: number[][];

    switch (rotation) {
      case 1:
        returnValue = [];
        for (var x = 0; x < numCols; x++) {
          returnValue[x] = [];
          for (var y = 0; y < numRows; y++) {
            returnValue[x][y] = input[y][numCols - x - 1];
          }
        }
        break;
      case 2:
        returnValue = [];
        for (var x = 0; x < numRows; x++) {
          returnValue[x] = [];
          for (var y = 0; y < numCols; y++) {
            returnValue[x][y] = input[numRows - x - 1][numCols - y - 1];
          }
        }
        break;
      case 3:
        returnValue = [];
        for (var x = 0; x < numCols; x++) {
          returnValue[x] = [];
          for (var y = 0; y < numRows; y++) {
            returnValue[x][y] = input[numRows - y - 1][x];
          }
        }
        break;
      default:
        returnValue = [];
        for (var x = 0; x < numRows; x++) {
          returnValue[x] = [];
          for (var y = 0; y < numCols; y++) {
            returnValue[x][y] = input[x][y];
          }
        }
        break;
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
      for (let y = 0; y < mapData[0].length; y += 1) {
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
