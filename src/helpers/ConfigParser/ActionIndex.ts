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
    return this.actions[action]
  }

  runAction<T>(action: string, table: DataSheet, tableColumn: number, team: number, type: string): T {
    return this.getAction(action)(table.getEntriesFromColumn(tableColumn, team, type));
  }
}
