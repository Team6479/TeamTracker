import React from "react";
import { PrimaryContext } from '../contexts';
import { Teams, FilterDisplay, Elements } from '../../helpers/ConfigParser/types';
import { TeamPreviw } from "../TeamPreview";
import NotFound from './not-found.gif';
import { TeamFilters } from '../TeamFilters';
import './TeamList.css'

interface TeamListProps {
  filters: Array<FilterDisplay>;
}

interface TeamListState {
  filters: Array<FilterDisplay>;
  search: string;
  filterOpen: boolean;
}

export class TeamList extends React.Component<TeamListProps, Readonly<TeamListState>> {
  static contextType = PrimaryContext;

  readonly state: Readonly<TeamListState> = {
    filters: this.props.filters,
    search: "",
    filterOpen: false,
  }

  renderTeams(): JSX.Element {
    let context: { elements: Elements, teams: Teams } = this.context;  // Bring us away from any type as soon as possible

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

  renderFilters(): JSX.Element {
    return <TeamFilters
      filters={this.state.filters}
      onChange={(object: Readonly<TeamListState>) => this.setState(object)}
    />
  }

  render(): JSX.Element {
    return (
      <div className="TeamList">
        <div className="filters">
          <div className="filter-wrapper search">
            <span className="filter-label">Search:</span>{' '}
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Type a team number..."
              value={this.state.search}
              onChange={e => this.setState({ search: e.target.value })}
            />
          </div>
          <div className="filter-wrapper">
            <button className="filter-button" onClick={() => this.setState({ filterOpen: !this.state.filterOpen })}>
              {this.state.filterOpen ? 'Close' : 'Open'} Filters
            </button>
          </div>
        </div>
        <h4 style={{ textAlign: "center" }}>Number of Teams: {Object.keys(this.context.teams).length}</h4>
        <div className="list-and-filters">
          {this.renderTeams()}
          {this.state.filterOpen ? this.renderFilters() : null}
        </div>
      </div>
    )
  }
}
