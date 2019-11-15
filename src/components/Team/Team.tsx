import './Team.css'
import React, { useContext } from 'react';
import { RouteComponentProps} from 'react-router-dom';
import { Teams, Elements } from '../../helpers/ConfigParser/types';
import { PrimaryContext } from '../contexts';

interface TeamProps {
  teamNum: string;
}

export const Team: React.FC<RouteComponentProps<TeamProps>> = (props): JSX.Element => {
  const teamNum = parseInt(props.match.params.teamNum);

  const context: {elements: Elements, teams: Teams} = useContext(PrimaryContext);
  const team = context.teams[teamNum];

  var list = [];
  for (const display of team.displays.list) {
    list.push((<h3 key={display.title}>{`${display.title}: ${display.value}`}</h3>))
  }

  return (
    <div className="Team" style={{borderRadius: '5px'}}>
      <h1 style={{ fontWeight: 1000 }}>{`${teamNum} - ${team.name}`}</h1>
      {list}
    </div>
  )
}
