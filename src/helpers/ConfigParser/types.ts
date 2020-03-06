import { IdReference } from './configParser';

export interface MainConfig {
  defaultGameYear: string;
  defaultEvent: string;
  yearsDir: string;
  eventsDir: string;
}

export interface GraphDisplay {
  title: string;
  _value: IdReference<number>;
  readonly value: number;
}

export interface ListDisplay {
  title: string;
  _value: IdReference<number | string>;
  readonly value: number | string;
}

export interface TableDisplay {
  title: string;
  _value: IdReference<Array<number | string>>;
  readonly value: Array<number | string>;
}

export interface TableFooterDisplay {
  title: string;
  _value: IdReference<number | string>;
  readonly value: number | string;
}

export interface Alliance {
  team_keys: Array<string>;
}

export interface Match {
  key: string;
  comp_level: string;
  match_number: number;
  alliances: {
    red: Alliance;
    blue: Alliance;
  }
  winning_alliance: string;
  post_result_time: number;
  set_number: number;
}

export interface Matches {
  [match_key: string]: Match
}

export interface FilterDisplay {
  title: string;
  id: string;
  min: number;
  max: number;
  localMin: number;
  localMax: number;
}

export interface Elements {
  [id: string]: { [team: number]: any }
}

export interface Displays {
  graph: Array<{
    title: string;
    id: string;
  }>;
  list: Array<{
    title: string;
    id: string;
  }>;
  table: Array<{
    title: string;
    id: string;
  }>;
  tableFooter: Array<{
    title: string;
    id: string;
  }>;
  filter: Array<{
    title: string;
    id: string;
    min: number;
    max: number;
  }>;
  [display: string]: Array<any>;
}

export interface YearConfig {
  elements: Array<{
    id: string;
    tableColumn: Array<number>;
    type: string;
    action: string;
  }>;
  displays: Displays;
}

export type SheetConfig = {
  spreadsheetId: string;
  range?: string;
  teamColumn: number;
}

export interface EventConfig {
  match: SheetConfig
  pit?: SheetConfig
}

export interface Team {
  name: string;
  displays: {
    graph: Array<GraphDisplay>;
    list: Array<ListDisplay>;
    table: Array<TableDisplay>;
    tableFooter: Array<TableFooterDisplay>;
    [key: string]: Array<any>; // Make this interface indexable
  }
}

export interface Teams {
  [team: number]: Team
}
