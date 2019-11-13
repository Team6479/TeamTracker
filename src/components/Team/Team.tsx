import './Team.css'
import React from 'react';
import { RouteComponentProps} from 'react-router-dom';
import { Teams } from '../../helpers/ConfigParser/types';
import { TeamsContext } from '../contexts';

interface TeamProps {
  teamNum: string;
}

export const Team: React.FC<RouteComponentProps<TeamProps>> = (props): JSX.Element => {
  const teamNum = parseInt(props.match.params.teamNum);

  function renderTeam(teams: Teams) {
    const team = teams[teamNum]
    var list = [];
    for (const display of team.displays.list) {
      list.push((<h3 key={display.title}>{`${display.title}: ${display.value}`}</h3>))
    }

    return (
      <div>
        <h1 style={{ fontWeight: 1000 }}>{`${teamNum} - ${team.name}`}</h1>
        {list}
      </div>
    )
  }

  return (
    <div className="Team" style={{borderRadius: '5px'}}>
      <TeamsContext.Consumer>
        {(teams) => renderTeam(teams)}
      </TeamsContext.Consumer>
    </div>
  )
}
