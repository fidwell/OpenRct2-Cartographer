export default class PeepFinder {
  public peepCount: number[][] = [];

  loadPeepData(mapSize: number): void {
    this.initializeArray(mapSize);

    const allPeeps = map.getAllEntities("peep");
    for (let p = 0; p < allPeeps.length; p++) {
      const x = Math.floor(allPeeps[p].x / 32);
      const y = Math.floor(allPeeps[p].y / 32);
      if (x < 0 || y < 0) continue;

      this.peepCount[x][y] += 1;
    }
  }

  private initializeArray(mapSize: number): void {
    for (let x = 0; x < mapSize; x += 1) {
      this.peepCount[x] = [];
      for (let y = 0; y < mapSize; y += 1) {
        this.peepCount[x][y] = 0;
      }
    }
  }
}
