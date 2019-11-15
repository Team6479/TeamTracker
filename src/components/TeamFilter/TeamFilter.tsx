import React from 'react';
import { FilterDisplay } from '../../helpers/ConfigParser/types';
import cloneDeep from 'lodash/cloneDeep'
import { FilterRange } from '../FilterRange';

interface TeamFilterProps {
  filters: Array<FilterDisplay>;
  onChange: Function
}

export const TeamFilter: React.FC<TeamFilterProps> = (props): JSX.Element => {

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
    filterElements.push((<FilterRange key={filter.id} filter={filter} onChange={onChange}/>))
  }

  return (
    <div>{filterElements}</div>
  )
}
