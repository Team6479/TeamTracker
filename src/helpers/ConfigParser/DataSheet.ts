export class DataSheet {
  private teamIndexes: {[team: number]: Array<number>} = {};

  constructor(private sheet: Array<Array<any>>) {}

  public getEntriesFromColumn<T>(column: number, team: number, type: string): Array<T> {
    let indexes: Array<number> = this.allIndexesOfTeam(team);

    let entries = [];
    for (let index of indexes) {
      let entry = this.sheet[column][index];
      if (entry === "") {
        switch(type) {
          case "number":
            entries.push(0);
            break;
          case "string":
            entries.push(entry);
            break;
        }
      } else {
        entries.push(entry);
      }
    }
    return entries;
  }

  private allIndexesOfTeam(team: number): Array<number> {
    if (this.teamIndexes[team] === undefined) {
      var array = this.sheet[0];
      var indexes: Array<number> = [];
      for(let i = 0; i < array.length; i++) {
        if (array[i] === team)
            indexes.push(i);
      }
      this.teamIndexes[team] = indexes;
      return indexes;
    } else {
      return this.teamIndexes[team];
    }
  }
}
