import { DataSheet } from './DataSheet';

/**
 * Class in charge of indexing and running actions
 */
export class ActionIndex {
  private actions: { [action: string]: Function; } = {};

  registerAction(action: Function) {
    this.actions[action.name] = action;
  }

  getAction(action: string): Function {
    if (action ===  null) {
      return action;
    }
    return this.actions[action];
  }

  runAction(action: string, table: DataSheet, tableColumn: Array<number>, team: number, type: string) {
    let entries: Array<number> | Array<Array<number>> = tableColumn.map<Array<number>>((column) => table.getEntriesFromColumn(column, team, type))

    if (entries.length === 1) {
      entries = entries[0]
    }

    if (action === null) {
      return entries;
    }
    let actionFunc = this.getAction(action);
    // console.log(`${team}  ${actionFunc.name} ${entries}`)
    // console.log(entries)

    try {
      return actionFunc(entries);
    } catch (e) {
      if ((e as Error).name === "TypeError") {
        throw TypeError(`Action: '${action}' is not a function. ${(e as Error).message}`);
      } else {
        throw SyntaxError(`Action: '${action}' failed. ${(e as Error).message}`);
      }
    }
  }
}
