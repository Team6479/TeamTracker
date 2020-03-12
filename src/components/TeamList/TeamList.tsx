import React, { useState, useContext } from "react";
import { PrimaryContext } from '../contexts';
import { FilterDisplay } from '../../helpers/ConfigParser/types';
import { TeamPreviw } from "../TeamPreview";
import NotFound from './not-found.gif';
import { TeamFilters } from '../TeamFilters';
import './TeamList.css'

interface TeamListProps {
  filters: Array<FilterDisplay>;
}

export const TeamList = (props: TeamListProps): JSX.Element => {
  const [filters, setFilters] = useState<Array<FilterDisplay>>(props.filters)
  const [search, setSearch] = useState<string>("")
  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  const primaryContext = useContext(PrimaryContext)

  function renderTeams(): JSX.Element {
    var teamNums = Object.keys(primaryContext.teams).map(teamNum => parseInt(teamNum));

    for (const filter of filters) {
      teamNums = teamNums.filter((teamNum) => {
        const teamVal = primaryContext.elements[filter.id][teamNum];
        return teamVal >= filter.localMin && teamVal <= filter.localMax;
      })
    }

    teamNums = teamNums.filter((teamNum) => {
      const regex = new RegExp(search, 'gi');
      return teamNum.toString().match(regex) || primaryContext.teams[teamNum].name.match(regex)
    })


    let teams = [];
    for (const teamNum of teamNums) {
      teams.push((<TeamPreviw teamNum={teamNum} key={teamNum} />))
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

  function renderFilters(): JSX.Element {
    return <TeamFilters
      filters={filters}
      onChange={setFilters}
    />
  }

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
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-wrapper">
          <button className="filter-button" onClick={() => setFilterOpen(!filterOpen)}>
            {filterOpen ? 'Close' : 'Open'} Filters
          </button>
        </div>
      </div>
      <h4 style={{ textAlign: "center" }}>Number of Teams: {Object.keys(primaryContext.teams).length}</h4>
      <div className="list-and-filters">
        {renderTeams()}
        {filterOpen ? renderFilters() : null}
      </div>
    </div>
  )
}
