import React from 'react';
import { Match } from '../../helpers/ConfigParser/types';
import { Link } from 'react-router-dom';
import './MatchTable.css';

interface MatchTableProps {
  matches: Array<Match>;
}

function getCompLevelTitle(compLevel: string, shorten?: boolean): string {
  switch(compLevel) {
    case "qm":
      return shorten ? "Quals" : "Qualifications";
    case "qf":
      return shorten ? "Quarters" : "Quarterfinals";
    case "sf":
      return shorten ? "Semis" : "Semifinals";
    case "f":
      return "Finals";
    default:
      return ""
  }
}

function getMatchName(key: string, compLevel: string) {
  var title = getCompLevelTitle(compLevel, true);
  var subKey = key.substring(key.indexOf("_") + 1 + compLevel.length);  // Here we strip away the event key and comp_level
  var subLevelCheck = subKey.indexOf("m");
  if (subLevelCheck !== -1) {
    console.log(subKey)
    title = `${title} ${subKey.substring(0, 1)} Match ${subKey.substring(subLevelCheck + 1)}`
  } else {
    title = `${title} ${subKey}`
  }
  return title;
}

function renderRow(match: Match) {
  const matchNameContainer = (
    <div className="match-name-container">
      <div className="match-name">
        <Link to={`/match/${match.key}`}>{getMatchName(match.key, match.comp_level)}</Link>
      </div>
    </div>
  )

  const redAlliance = match.alliances.red.team_keys.map((key): [string, JSX.Element] => {
    const team = key.substring(3);
    return [`${match.key}_${team}`, (<Link key={team} to={`/team/${team}`}>{team}</Link>)]
  })
  const blueAlliance = match.alliances.blue.team_keys.map((key): [string, JSX.Element] => {
    const team = key.substring(3);
    return [`${match.key}_${team}`, (<Link key={team} to={`/team/${team}`}>{team}</Link>)]
  })

  return (
    <React.Fragment key={match.key}>
      <tr key={`vis${match.key}`} className="visible-lg">
        <td>
          {matchNameContainer}
        </td>
        {redAlliance.map(([key, element]) => (<td key={key} colSpan={2} className="red">{element}</td>))}
        {blueAlliance.map(([key, element]) => (<td key={key} colSpan={2} className="blue">{element}</td>))}
      </tr>
      <tr key={`hid1${match.key}`} className="hidden-lg compact-row">
        <td rowSpan={2}>{matchNameContainer}</td>
        {redAlliance.map(([key, element]) => (<td key={key} colSpan={4} className="red">{element}</td>))}
      </tr>
      <tr key={`hid2${match.key}`} className="hidden-lg">
        {blueAlliance.map(([key, element]) => (<td key={key} colSpan={4} className="blue">{element}</td>))}
      </tr>
    </React.Fragment>
  )
}

function renderTbody(matches: Array<Match>) {
  const tbody: Array<JSX.Element> = []
  var prevCompLevel = "";
  for (const match of matches) {
    if (prevCompLevel !== match.comp_level) {
      tbody.push((<tr key={match.comp_level} className="key"><th colSpan={16}>{getCompLevelTitle(match.comp_level)}</th></tr>))
    }
    prevCompLevel = match.comp_level;

    tbody.push(renderRow(match))
  }
  return tbody;
}

export const MatchTable: React.FC<MatchTableProps> = (props) => {
  return (
    <table className="MatchTable">
      <thead>
        <tr className="key visible-lg">
          <th>Match</th>
          <th colSpan={6}>Red Alliance</th>
          <th colSpan={6}>Blue Alliance</th>
        </tr>
        <tr className="key hidden-lg">
          <th rowSpan={2}>Match</th>
          <th colSpan={12}>Red Alliance</th>
        </tr>
        <tr className="key hidden-lg">
          <th colSpan={12}>Blue Alliance</th>
        </tr>
      </thead>
      <tbody>
        {renderTbody(props.matches)}
      </tbody>
    </table>
  )
}
