export default class PeepFinder {
  public peepCount: number[][] = [];

  public maxPeeps: number = 0;

  loadPeepData(mapWidth: number, mapHeight: number): void {
    this.initializeArray(mapWidth, mapHeight);

    const allPeeps = map.getAllEntities("guest");
    for (let p = 0; p < allPeeps.length; p += 1) {
      const x = Math.floor(allPeeps[p].x / 32) - 1;
      const y = Math.floor(allPeeps[p].y / 32) - 1;
      if (x >= 0 && y >= 0) {
        this.peepCount[x][y] += 1;
        if (this.peepCount[x][y] > this.maxPeeps) {
          this.maxPeeps = this.peepCount[x][y];
        }
      }
    }
  }

  private initializeArray(mapWidth: number, mapHeight: number): void {
    for (let x = 0; x < mapWidth; x += 1) {
      this.peepCount[x] = [];
      for (let y = 0; y < mapHeight; y += 1) {
        this.peepCount[x][y] = 0;
      }
    }
  }
}
