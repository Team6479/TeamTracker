import React from 'react';
import { FilterDisplay } from '../../helpers/ConfigParser/types';
import cloneDeep from 'lodash/cloneDeep'
import { FilterRange } from '../FilterRange';
import './TeamFilters.css'

interface TeamFiltersProps {
  filters: Array<FilterDisplay>;
  onChange: Function;
}

export const TeamFilters: React.FC<TeamFiltersProps> = (props): JSX.Element => {

  var onChange = (filter: FilterDisplay, values: Array<number>) => {
    var filters: Array<FilterDisplay> = cloneDeep(props.filters)
    filters[props.filters.indexOf(filter)].localMin = values[0];
    filters[props.filters.indexOf(filter)].localMax = values[1];

    props.onChange({
      filters: filters
    })
  }

  var filterElements = []
  for (const filter of props.filters) {
    filterElements.push((
      <div className="filter-item" key={filter.id}>
        <h5>{filter.title}</h5>
        <FilterRange key={filter.id} filter={filter} onChange={onChange}/>
        <hr/>
      </div>
    ))
  }

  return (
    <div className="TeamFilters">
      <div className="filter-card">
        <h3>Filters</h3>
        <div className="filter-item">
          {filterElements}
        </div>
      </div>

    </div>
  )
}
