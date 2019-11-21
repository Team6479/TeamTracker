import * as actions from './actions';
import { DataSheet } from './DataSheet';

/**
 * Class in charge of indexing and running actions
 */
export class ActionIndex {
  private actions: { [action: string]: Function; } = {};

  constructor() {
    for (let item of Object.values(actions)) {
      if (typeof item === "function") {
        this.registerAction(item);
      }
    }
  }

  registerAction(action: Function) {
    this.actions[action.name] = action;
  }

  getAction(action: string): Function {
    if (action ===  null) {
      return action;
    }
    return this.actions[action];
  }

  runAction<T>(action: string, table: DataSheet, tableColumn: number, team: number, type: string): T | T[] {
    let entries = table.getEntriesFromColumn<T>(tableColumn, team, type);
    if (action === null) {
      return entries;
    }

    let actionFunc = this.getAction(action);

    try {
      return actionFunc(entries);
    } catch {
      throw TypeError(`Action: '${action}' is not a function. ${actionFunc}`);
    }
  }
}
