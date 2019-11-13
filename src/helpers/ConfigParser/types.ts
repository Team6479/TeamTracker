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
  readonly value: number | string;
}

export interface FilterDisplay {
  title: string;
  id: string;
  min: number;
  max: number;
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
    tableColumn: number;
    type: string;
    action: string;
  }>;
  displays: Displays;
}

export type SheetConfig = {
  spreadsheetId: string;
  range?: string;
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
    [key: string]: Array<any>; // Make this interface indexable
  }
}

export interface Teams {
  [team: number]: Team
}