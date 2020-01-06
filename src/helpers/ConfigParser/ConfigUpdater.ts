import { configPromise, getParsedState } from './configParser';
import { Elements, Teams, FilterDisplay, Match, Matches } from './types';

export interface ParsedState {
  matches: Matches;
  elements: Elements;
  teams: Teams;
  filters: Array<FilterDisplay>;
}

/**
 * Class in charge of handeling updates to the state
 */
export class StateUpdater {
  private updateInterval?: NodeJS.Timeout;
  private updater?: Promise<void>;
  private updaterCompleted: boolean = true;
  private firstUpdate: boolean = true;
  private matchLastModified: string = "";

  /**
   * @param onUpdate A function to be called on state update. It will be passed `currentMatch, elements, teams, and filters` as an object.
   */
  constructor(private onUpdate: (state: ParsedState) => void, private onFirstUpdate: () => void) { }

  /**
   * Start updating the state
   */
  start(): void {
    this.spawnUpdater(
      (value: boolean) => { this.updaterCompleted = value },
      (value: boolean) => { this.firstUpdate = value }
    );
    this.updateInterval = setInterval(() => {
      this.spawnUpdater(
        (value: boolean) => { this.updaterCompleted = value },
        (value: boolean) => { this.firstUpdate = value }
      )
    }, 30000);
  }

  private spawnUpdater(setUpdaterCompleted: (value: boolean) => void, setFirstUpdate: (value: boolean) => void): void {
    const spawn = async () => {
      const matches: Matches | undefined = await (async () => {
        const [blueallianceInstance, , , ,] = await configPromise;
        var matches_array: Array<Match> = []
        try {
          matches_array = await blueallianceInstance.get('matches', {headers: {"If-Modified-Since": this.matchLastModified}})
            .then((response) => {
              this.matchLastModified = response.headers["last-modified"];
              return response.data
            });
        } catch {
          return;
        }

        return matches_array.reduce<Matches>((matches: Matches, match) => {
          matches[match.key] = match;
          return matches;
        }, {});
      })();

      if (matches === undefined) {
        console.debug("No updates to state required...")
        return;
      }

      var [elements, teams, filters] = await getParsedState()

      for (const matchKey of Object.keys(matches)) {
        const match = matches[matchKey]
        const teamKeys = [...match.alliances.blue.team_keys, ...match.alliances.red.team_keys]
        for (const teamKey of teamKeys) {
          const teamNum = parseInt(teamKey.substring(3));  // substring(3) strips out the 'frc' prefix in the key
          const team = teams[teamNum];
          if (!Object.keys(team.displays).includes("matches")) {
            team.displays["matches"] = []
          }
          team.displays["matches"].push(match);
        }
      }

      this.onUpdate({
        matches: matches,
        elements: elements,
        teams: teams,
        filters: filters
      });
      console.debug("Updater Completed!");
    }

    if (this.updaterCompleted) {
      console.debug(`Updater Spawned at: ${Date.now()}`);
      setUpdaterCompleted(false);
      this.updater = spawn().then(() => { setUpdaterCompleted(true) });

      if (this.firstUpdate) {
        this.updater.then(this.onFirstUpdate);
        setFirstUpdate(false);
      }
    } else {
      console.debug(`Previous Update has yet to finish: ${Date.now()}`);
    }
  }

  /**
   * Cancel updates to the StateUpdater
   */
  cancel(): void {
    if (this.updateInterval !== undefined) {
      clearInterval(this.updateInterval);
    }
  }
}
