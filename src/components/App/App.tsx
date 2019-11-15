import './App.css';
import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import logo from '../../logo.svg'
import { getParsedState } from '../../helpers/ConfigParser';
import { Elements, Teams, FilterDisplay } from '../../helpers/ConfigParser/types';
import { Team } from '../Team';
import { TeamList } from '../TeamList';
import PacmanLoader from 'react-spinners/PacmanLoader';
import { PrimaryContext } from '../contexts';


interface AppState {
  elements: Elements;
  teams: Teams;
  filters: Array<FilterDisplay>;
  loading: boolean;
}

export class App extends React.Component<{}, Readonly<AppState>> {
  readonly state: AppState = {
    elements: {},
    teams: [],
    filters: [],
    loading: true
  }

  constructor(props: Readonly<{}>) {
    super(props)
    getParsedState(this.state.elements).then(([elements, teams, filters]) => this.setState({elements: elements, teams: teams, filters: filters,loading: false}))
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
                <Route path="/team/:teamNum" component={Team} />
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
