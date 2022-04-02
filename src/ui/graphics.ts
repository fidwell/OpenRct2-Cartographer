export default class Graphics {
  static allocateImage(pixelData: PixelData) {
    var range = ui.imageManager.allocate(1);
    if (range) {
      ui.imageManager.setPixelData(range.start, pixelData);
      return range.start;
    }
    return undefined;
  }

  static setPixelData(imageId: number, pixelData: PixelData) {
    ui.imageManager.setPixelData(imageId, pixelData);
  }

  static freeImage(imageId: number) {
    ui.imageManager.free({ start: imageId, count: 1 });
  }
}
