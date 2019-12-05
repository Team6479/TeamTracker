import { configPromise, getParsedState } from './configParser';
import { Elements, Teams, FilterDisplay, Match } from './types';

export interface ParsedState {
  currentMatch: Match;
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
  private lastMatchIndex: number = 0;
  private updaterCompleted: boolean = true;
  private firstUpdate: boolean = true;

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

  private spawnUpdater(setUpdaterCompleted: (value: boolean) => void, setFirstUpdate: (value: boolean) => void) {
    const spawn = async () => {
      const [blueallianceInstance, , , ,] = await configPromise;
      const matches: Array<Match> = await blueallianceInstance.get('matches').then((response) => response.data);
      for (const match of matches.slice(this.lastMatchIndex)) {
        let matchIndex: number = matches.indexOf(match)
        if (match.post_result_time > 0
            && (match.alliances.red.team_keys.includes("frc6479") || match.alliances.blue.team_keys.includes("frc6479"))
            && this.lastMatchIndex !== matchIndex) {
          const [elements, teams, filters] = await getParsedState();
          this.lastMatchIndex = matchIndex;
          this.onUpdate({
            currentMatch: match,
            elements: elements,
            teams: teams,
            filters: filters
          });
        }
      }
      console.debug("Updater Completed!");
    }

    if (this.updaterCompleted) {
      console.debug(`Updater Spawned at: ${Date.now()}`);
      setUpdaterCompleted(false)
      this.updater = spawn().then(() => { setUpdaterCompleted(true) });

      if (this.firstUpdate) {
        this.updater.then(this.onFirstUpdate);
        setFirstUpdate(false);
      }
    } else {
      console.debug(`Previous Update has yet to finish: ${Date.now()}`)
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
