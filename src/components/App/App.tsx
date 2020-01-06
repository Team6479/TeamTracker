import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import logo from '../../logo.svg'
import { StateUpdater, ParsedState } from '../../helpers/ConfigParser/ConfigUpdater';
import { Elements, Teams, FilterDisplay, Matches } from '../../helpers/ConfigParser/types';
import { TeamList } from '../TeamList';
import PacmanLoader from 'react-spinners/PacmanLoader';
import { PrimaryContext, MatchesContext } from '../contexts';
import { MatchPreview } from '../MatchPreview';
import { TeamOverview } from '../TeamOverview/TeamOverview';
import './App.css';


interface AppState {
  matches: Matches;
  elements: Elements;
  teams: Teams;
  filters: Array<FilterDisplay>;
  loading: boolean;
}

export class App extends React.Component<{}, Readonly<AppState>> {
  readonly state: Readonly<AppState> = {
    matches: {},
    elements: {},
    teams: [],
    filters: [],
    loading: true
  }

  private updater: Readonly<StateUpdater> = new StateUpdater((data: ParsedState) => this.setState(data), () => this.setState({loading: false}));

  constructor(props: Readonly<{}>) {
    super(props)

    this.updater.start()
  }

  renderBody() {
    if (this.state.loading) {
      return (
        <div className="Loading">
          <PacmanLoader color="#6aa84f" loading={this.state.loading} />
        </div>
      );
    } else {
      return (
        <div>
          <BrowserRouter>
            <Switch>
              <PrimaryContext.Provider value={{elements: this.state.elements, teams: this.state.teams}}>
                <Route path="/" render={() => <TeamList filters={this.state.filters}/>} exact />
                <Route path="/team/:teamNum" component={TeamOverview} />
                <MatchesContext.Provider value={this.state.matches}>
                  <Route path="/match/:matchKey" component={MatchPreview} />
                </MatchesContext.Provider>
              </PrimaryContext.Provider>
            </Switch>
          </BrowserRouter>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">TeamTracker</h1>
          <p>
            Team Scouting App created by the AZTECH
          </p>
        </header>
        {this.renderBody()}
        <footer className="App-footer">
          <p>
            Made by{' '}
            <a href="https://team6479.org">AZTECH 6479</a>
          </p>
        </footer>
      </div>
    )
  }
}
