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
      const matches_array: Array<Match> = await blueallianceInstance.get('matches').then((response) => response.data);
      var matches: Matches = matches_array.reduce((matches: Matches, match) => {
        matches[match.key] = match;
        return matches;
      }, {});
      const [elements, teams, filters] = await getParsedState();
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
