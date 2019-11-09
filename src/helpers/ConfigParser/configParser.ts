import axios, { AxiosInstance } from 'axios';
import { GraphDisplay, ListDisplay, TableDisplay, MainConfig, YearConfig, EventConfig, Elements, Teams, Team } from './types';
import { ActionIndex } from './ActionIndex';
import { DataSheet } from './DataSheet';

export class IdReference<T> {
  constructor(private object: Elements, private id: string, private team: number) {}

  get(): T {
     return this.object[this.id][this.team];
  }
}

async function getLatestCommit(): Promise<string> {
  var response = await axios.get('https://api.github.com/repos/iboyperson/TeamTracker-TestConfig/commits/master');
  return response.data.sha;
}

function injectActionScript(commit: string, mainConfig: MainConfig): Promise<ActionIndex> {
  var actionsScript = document.createElement('script');
  var actionsScriptLoad = new Promise<ActionIndex>((resolve) => {
    actionsScript.onload = () => {
      let actionIndex = new ActionIndex();
      // @ts-ignore window.actions is loaded at runtime
      for (let item of Object.values(window.actions)) {
        if (typeof item === "function") {
          actionIndex.registerAction(item);
        }
      }
      resolve(actionIndex);
    }
  })
  actionsScript.src = `https://cdn.jsdelivr.net/gh/iboyperson/TeamTracker-TestConfig@${commit}/${mainConfig.yearsDir}/${mainConfig.defaultGameYear}/actions.min.js`;
  document.head.appendChild(actionsScript);

  return actionsScriptLoad;
}

function getRawgitInstance(commit: string): AxiosInstance {
  return axios.create({
    baseURL: `https://raw.githubusercontent.com/iboyperson/TeamTracker-TestConfig/${commit}/`
  });
}

function getBlueallianceInstance(mainConfig: MainConfig): AxiosInstance {
  return axios.create({
    baseURL: `https://www.thebluealliance.com/api/v3/event/${mainConfig.defaultEvent}/`,
    headers: { 'Accept': 'application/json', 'X-TBA-Auth-Key': 'NTzpTFdnASplharZXjaUdE2yCTRw0LXD9cVSz9Ox2ulKRuJXfpvNyThzSudidh2X' }
  });
}

async function getMainConfig(rawgitInstance: AxiosInstance): Promise<MainConfig> {
  var response = await rawgitInstance.get<MainConfig>('config.json');
  return response.data
}

async function getYearConfig(rawgitInstance: AxiosInstance, mainConfig: MainConfig): Promise<YearConfig> {
  var response = await rawgitInstance.get<YearConfig>(`${mainConfig.yearsDir}/${mainConfig.defaultGameYear}/config.json`);
  return response.data
}

async function getEventConfig(rawgitInstance: AxiosInstance, mainConfig: MainConfig): Promise<EventConfig> {
  var response = await rawgitInstance.get<EventConfig>(`${mainConfig.eventsDir}/${mainConfig.defaultEvent}.json`);
  return response.data
}

async function getGoogleSheet(eventConfig: EventConfig): Promise<DataSheet> {
  return new Promise((resolve) => {
    window.gapi.load('client', () => {
      window.gapi.client.init({
        apiKey: 'AIzaSyC1bxZaTOj6Nu8otaC-teW1Tb5anLaAG2E',
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest'],
      })
        .then(() => window.gapi.client.load("sheets", "v4"))
        .then(() => {
          // @ts-ignore typing for gapi is a little weak
          return window.gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: eventConfig.match.spreadsheetId,
            range: eventConfig.match.range ? eventConfig.match.range : 'Form Responses 1',
            majorDimension: 'COLUMNS',
            valueRenderOption: 'UNFORMATTED_VALUE'
          })
        })
        .then((response: {result: {values: Array<Array<any>>}}) => resolve(new DataSheet(response.result.values)))
    })
  })
}

// async function getElements(yearConfig: YearConfig, teamNum: number, elements?: Elements) {
//   if (elements === undefined) {
//     elements = {};
//   }

//   for (let element of yearConfig.elements) {
//     if (elements[element.id] === undefined) {
//       elements[element.id] = {};
//     }

//     elements[element.id][teamNum] = actionIndex.runAction(element.action, sheet, element.tableColumn, teamNum, element.type);
//   }
// }

export async function getTeams(): Promise<Teams> {
  let commit = await getLatestCommit();
  let rawgitInstance = getRawgitInstance(commit);
  let mainConfig = await getMainConfig(rawgitInstance);
  let blueallianceInstance = getBlueallianceInstance(mainConfig);
  let eventConfigPromise = await getEventConfig(rawgitInstance, mainConfig);

  let [yearConfig, teamsResponse, actionIndex, sheet] = await Promise.all([
    getYearConfig(rawgitInstance, mainConfig),
    blueallianceInstance.get<Array<any>>('teams/simple'),
    injectActionScript(commit, mainConfig),
    getGoogleSheet(eventConfigPromise)
  ])

  var elements: Elements = {};
  var teams: Teams = {};

  for (let team of teamsResponse.data) {
    let teamNum = team.team_number;

    // TODO: Investigate ways of asynchronizing to prevent long running actions from blocking.
    for (let element of yearConfig.elements) {
      if (elements[element.id] === undefined) {
        elements[element.id] = {};
      }

      elements[element.id][teamNum] = actionIndex.runAction(element.action, sheet, element.tableColumn, teamNum, element.type);
    }

    let data: Team = {
      graph: new Array<GraphDisplay>(),
      list: new Array<ListDisplay>(),
      table: new Array<TableDisplay>(),
    }

    // We do this as filter needs to be handled differently
    let displays = Object.keys(yearConfig.displays).filter((value) => value !== "filter");
    for (let display of displays) {
      for (let element of yearConfig.displays[display]) {
        data[display].push({
          title: element.title,
          _value: new IdReference(elements, element.id, teamNum),
          get value() {
            return this._value.get()
          }
        })
      }
    }

    teams[teamNum] = data;
  }

  return teams;
}
