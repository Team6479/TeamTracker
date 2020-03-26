import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import logo from '../../logo.svg'
import { StateUpdater, ParsedState } from '../../helpers/ConfigParser/ConfigUpdater';
import { TeamList } from '../TeamList';
import PacmanLoader from 'react-spinners/PacmanLoader';
import { PrimaryContext, MatchesContext } from '../contexts';
import { MatchPreview } from '../MatchPreview';
import { TeamOverview } from '../TeamOverview/TeamOverview';
import './App.css';


function renderBody(state: ParsedState, loading: boolean) {
  if (loading) {
    return (
      <div className="Loading">
        <PacmanLoader color="#6aa84f" loading={loading} />
      </div>
    );
  } else {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <PrimaryContext.Provider value={{elements: state.elements, teams: state.teams}}>
              <Route path="/" render={() => <TeamList filters={state.filters}/>} exact />
              <Route path="/team/:teamNum" component={TeamOverview} />
              <MatchesContext.Provider value={state.matches}>
                <Route path="/match/:matchKey" component={MatchPreview} />
              </MatchesContext.Provider>
            </PrimaryContext.Provider>
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}

export const App = () => {
  const [state, setState] = useState<ParsedState>({
    matches: {},
    elements: {},
    teams: [],
    filters: []
  })
  const [loading, setLoading] = useState(true)
  const [updater,] = useState<StateUpdater>(new StateUpdater((data: ParsedState) => setState(data), () => setLoading(false)))

  useEffect(() => updater.start(), [updater])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">TeamTracker</h1>
        <p>
          Team Scouting App created by the AZTECH
        </p>
      </header>
      {renderBody(state, loading)}
      <footer className="App-footer">
        <p>
          Made by{' '}
          <a href="https://team6479.org">AZTECH 6479</a>
        </p>
      </footer>
    </div>
  )
}
