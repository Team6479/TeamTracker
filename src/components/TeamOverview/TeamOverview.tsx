import './TeamOverview.css'
import React, { useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Teams, Elements } from '../../helpers/ConfigParser/types';
import { PrimaryContext } from '../contexts';

interface TeamOverviewProps {
  teamNum: string;
}

export const TeamOverview: React.FC<RouteComponentProps<TeamOverviewProps>> = (props): JSX.Element => {
  const teamNum = parseInt(props.match.params.teamNum);

  const context: {elements: Elements, teams: Teams} = useContext(PrimaryContext);
  const team = context.teams[teamNum];

  const list: Array<JSX.Element> = team.displays.list.map<JSX.Element>((listDisplay) => {
    return (<h3 key={listDisplay.title}>{`${listDisplay.title}: ${listDisplay.value}`}</h3>)
  })

  return (
    <div className="TeamOverview" style={{borderRadius: '5px'}}>
      <h1 style={{ fontWeight: 1000 }}>{`${teamNum} - ${team.name}`}</h1>
      {list}
    </div>
  )
}
