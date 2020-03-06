type TeamEntriesPerColumn = {
  [team: number]: {
    [column: number]: {
      [type: string]: Array<any>
    }
  }
}

export class DataSheet {
  private teamIndexes: {[team: number]: Array<number>} = {};
  private teamEntriesPerColumn: TeamEntriesPerColumn = {};

  constructor(private sheet: Array<Array<any>>, private teamColumn: number) {}

  public getEntriesFromColumn<T>(column: number, team: number, type: string): Array<T> {
    try {
      return this.teamEntriesPerColumn[team][column][type];
    } catch {
      let indexes: Array<number> = this.allIndexesOfTeam(team);

      let entries = [];
      for (let index of indexes) {
        let entry = this.sheet[column][index];
        if (entry === "") {
          switch(type) {
            case "number":
              entries.push(0);
              break;
            default:
              entries.push(entry);
              break;
          }
        } else {
          entries.push(entry);
        }
      }

      if (this.teamEntriesPerColumn[team] === undefined) {
        this.teamEntriesPerColumn[team] = {}
        this.teamEntriesPerColumn[team][column] = {}
      } else if (this.teamEntriesPerColumn[team][column] === undefined) {
        this.teamEntriesPerColumn[team][column] = {}
      }

      this.teamEntriesPerColumn[team][column][type] = entries;

      return entries;
    }
  }

  private allIndexesOfTeam(team: number): Array<number> {
    if (this.teamIndexes[team] === undefined) {
      var array = this.sheet[this.teamColumn];
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
