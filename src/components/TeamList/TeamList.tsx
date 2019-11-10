import './TeamList.css'
import React from "react";
import { TeamsContext } from '../contexts';
import { Teams } from '../../helpers/ConfigParser/types';
import { TeamPreviw } from "../TeamPreview/TeamPreview";
import NotFound from './not-found.gif';

export class TeamList extends React.Component {
  static contextType = TeamsContext;

  renderTeams() {
    let context: Teams = this.context;
    let teams = [];
    for (const teamNum of Object.keys(context)) {
      teams.push((<div key={teamNum} ><TeamPreviw teamNum={parseInt(teamNum)} /></div>))
    }
    if (teams.length > 0) {
      return (
        <ul className='list'>
          {teams}
        </ul>
      )
    } else {
      return (
        <div className="no-results">
          <h2>Looks like there aren't any teams that match your search</h2>
          <img src={NotFound} alt="No Results" />
        </div>
      )
    }
  }

  render(): JSX.Element {
    return (
      <div className="TeamList">
        {this.renderTeams()}
      </div>
    )
  }
}
