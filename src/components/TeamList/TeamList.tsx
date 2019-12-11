import './TeamList.css'
import React from "react";
import { PrimaryContext } from '../contexts';
import { Teams, FilterDisplay, Elements } from '../../helpers/ConfigParser/types';
import { TeamPreviw } from "../TeamPreview";
import NotFound from './not-found.gif';
import { TeamFilters } from '../TeamFilters';

interface TeamListProps {
  filters: Array<FilterDisplay>;
}

interface TeamListState {
  filters: Array<FilterDisplay>;
  search: string;
}

export class TeamList extends React.Component<TeamListProps, Readonly<TeamListState>> {
  static contextType = PrimaryContext;

  readonly state: Readonly<TeamListState> = {
    filters: this.props.filters,
    search: ""
  }

  renderTeams() {
    let context: {elements: Elements, teams: Teams} = this.context;  // Bring us away from any type as soon as possible

    var teamNums = Object.keys(context.teams).map(teamNum => parseInt(teamNum));

    for (const filter of this.state.filters) {
      teamNums = teamNums.filter((teamNum) => {
        const teamVal = context.elements[filter.id][teamNum];
        return teamVal >= filter.localMin && teamVal <= filter.localMax;
      })
    }

    teamNums = teamNums.filter((teamNum) => {
      const regex = new RegExp(this.state.search, 'gi');
      return teamNum.toString().match(regex) || context.teams[teamNum].name.match(regex)
    })


    let teams = [];
    for (const teamNum of teamNums) {
      teams.push((<TeamPreviw teamNum={teamNum} key={teamNum}/>))
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
        <div className="search">
          <span className="filter-label">Search:</span>{' '}
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Type a team number..."
            value={this.state.search}
            onChange={e => this.setState({search: e.target.value})}
          />
        </div>
        <TeamFilters filters={this.state.filters} onChange={(object: Readonly<TeamListState>) => this.setState(object)}/>
        {this.renderTeams()}
      </div>
    )
  }
}
