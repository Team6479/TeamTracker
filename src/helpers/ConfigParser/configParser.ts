import axios, { AxiosInstance } from 'axios';
import { GraphDisplay, ListDisplay, TableDisplay, MainConfig, YearConfig, EventConfig, Elements, Teams, Team, FilterDisplay } from './types';
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

function injectActionScript(commit: string, mainConfig: MainConfig, actionIndex?: ActionIndex): Promise<ActionIndex> {
  var actionsScript = document.createElement('script');
  var actionsScriptLoad = new Promise<ActionIndex>((resolve) => {
    actionsScript.onload = () => {
      if (actionIndex ===  undefined) {
        actionIndex = new ActionIndex();
      }
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

function injectGlobalActionScript(commit: string, actionIndex?: ActionIndex): Promise<ActionIndex> {
  var actionsScript = document.createElement('script');
  var actionsScriptLoad = new Promise<ActionIndex>((resolve) => {
    actionsScript.onload = () => {
      if (actionIndex ===  undefined) {
        actionIndex = new ActionIndex();
      }
      // @ts-ignore window.actions is loaded at runtime
      for (let item of Object.values(window.globalActions)) {
        if (typeof item === "function") {
          actionIndex.registerAction(item);
        }
      }
      resolve(actionIndex);
    }
  })
  actionsScript.src = `https://cdn.jsdelivr.net/gh/iboyperson/TeamTracker-TestConfig@${commit}/globalActions.min.js`;
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

const configPromise: Promise<[AxiosInstance, YearConfig, EventConfig, ActionIndex, Array<any>]> = (async (): Promise<[AxiosInstance, YearConfig, EventConfig, ActionIndex, Array<any>]> => {
  const commit = await getLatestCommit();
  const rawgitInstance = getRawgitInstance(commit);
  const mainConfig = await getMainConfig(rawgitInstance);
  const blueallianceInstance = getBlueallianceInstance(mainConfig);

  const [yearConfig, eventConfig, actionIndex, teams] = await Promise.all<YearConfig, EventConfig, ActionIndex, Array<any>>([
    getYearConfig(rawgitInstance, mainConfig),
    getEventConfig(rawgitInstance, mainConfig),
    injectActionScript(commit, mainConfig, await injectGlobalActionScript(commit)),
    blueallianceInstance.get<Array<any>>('teams/simple').then(response => response.data)
  ])

  return [blueallianceInstance, yearConfig, eventConfig, actionIndex, teams]
})()

export async function getElements(elements?: Elements): Promise<Elements> {
  const [blueallianceInstance, yearConfig, eventConfig, actionIndex, teamsInfo] = await configPromise;

  let [rawTeamRankings, teamOprs, sheet] = await Promise.all([
    blueallianceInstance.get<{rankings: Array<any>}>('rankings').then(response => response.data.rankings),
    blueallianceInstance.get<{oprs: {[team_key: string]: number}
                              dprs: {[team_key: string]: number}}>('oprs').then(response => response.data),
    getGoogleSheet(eventConfig)
  ])

  if (elements === undefined) {
    elements = {};
  }

  // Add Ids for arbitrarily inserting Blue Alliance data as elements
  elements["blueallianceRank"] = {};
  elements["blueallianceOPR"] = {};
  elements["blueallianceDPR"] = {};

  // Process Blue Alliance ranking for easier access
  var teamRankings: { [team_key: string]: number } = {};
  rawTeamRankings.forEach(team => {
    teamRankings[team.team_key] = team.rank
  });

  for (let team of teamsInfo) {
    let teamNum = team.team_number;

    // Arbitrarily insert Blue Alliance data as elements
    elements["blueallianceRank"][teamNum] = teamRankings[team.key];
    elements["blueallianceOPR"][teamNum] = Math.round(teamOprs.oprs[team.key]);
    elements["blueallianceDPR"][teamNum] = Math.round(teamOprs.dprs[team.key]);

    for (let element of yearConfig.elements) {
      if (elements[element.id] === undefined) {
        elements[element.id] = {};
      }

      elements[element.id][teamNum] = actionIndex.runAction(element.action, sheet, element.tableColumn, teamNum, element.type);
    }
  }

  return elements
}

export async function getTeams(elements: Elements): Promise<Teams> {
  const [, yearConfig,,, teamsInfo] = await configPromise;

  var teams: Teams = {};
  for (let team of teamsInfo) {
    let teamNum = team.team_number;

    let data: Team = {
      name: "",
      displays: {
        graph: new Array<GraphDisplay>(),
        list: new Array<ListDisplay>(),
        table: new Array<TableDisplay>(),
      }
    }

    data.name = team.nickname;

    // Arbitrarily insert Blue Alliance data to list display
    data.displays.list.push({
      title: "Blue Alliance Rank",
      _value: new IdReference(elements, "blueallianceRank", teamNum),
      get value() {
        return this._value.get()
      }
    })
    data.displays.list.push({
      title: "Offensive Power Rank",
      _value: new IdReference(elements, "blueallianceOPR", teamNum),
      get value() {
        return this._value.get()
      }
    })
    data.displays.list.push({
      title: "Defensive Power Rank",
      _value: new IdReference(elements, "blueallianceDPR", teamNum),
      get value() {
        return this._value.get()
      }
    })

    // We do this as filter needs to be handled differently
    let displays = Object.keys(yearConfig.displays).filter((value) => value !== "filter");
    for (let display of displays) {
      for (let element of yearConfig.displays[display]) {
        data.displays[display].push({
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


export async function getParsedState(elements: Elements): Promise<[Elements, Teams, Array<FilterDisplay>]> {
  if (elements === undefined) {
    elements = await getElements();
  } else {
    await getElements(elements);
  }
  const teams = await getTeams(elements);

  const [, yearConfig,,,] = await configPromise;

  var filters = []
  for (let element of yearConfig.displays.filter) {
    filters.push({
      title: element.title,
      id: element.id,
      min: element.min,
      max: element.max,
      localMin: element.min,
      localMax: element.max
    })
  }

  return [elements, teams, filters];
}
