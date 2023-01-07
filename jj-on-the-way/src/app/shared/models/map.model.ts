export class Map {
  constructor(
      public id: string,
      public pins: {x: string, y: string, country: string}[],
  ) { }
}
