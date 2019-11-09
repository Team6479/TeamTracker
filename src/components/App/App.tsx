import React from 'react';
import logo from '../../logo.svg'
import './App.css';
import { getTeams } from '../../helpers/ConfigParser';

export const App: React.FunctionComponent = () => {
  getTeams().then((teams) => console.log(teams[2478].graph[0].value));
  // getTeams().then(console.log)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">TeamTracker</h1>
        <p>
          Team Scouting App created by the AZTECH
        </p>
      </header>
      {/* <TeamList /> */}
      <footer className="App-footer">
        <p>
          Made by{' '}
          <a href="https://team6479.org">AZTECH 6479</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
