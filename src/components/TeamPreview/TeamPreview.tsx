import './TeamPreview.css'
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { PrimaryContext } from '../contexts';
import { Teams, Elements } from '../../helpers/ConfigParser/types';
import { TeamGraph } from '../TeamGraph';

interface TeamPreviewProps {
  teamNum: number
}

export const TeamPreviw: React.FC<TeamPreviewProps> = (props): JSX.Element => {
  const context: {elements: Elements, teams: Teams} = useContext(PrimaryContext);
  let team = context.teams[props.teamNum];
  let graphDisplay = team.displays.graph

  return (
    <li className="TeamPreview">
      <div>
        <h3><Link to={`/team/${props.teamNum}`}>{ `${props.teamNum} - ${team.name}`}</Link></h3>
      </div>

      <div>
        Blue Alliance Rank:  <span className="number">{context.elements["blueallianceRank"][props.teamNum]}</span>
      </div>
      <div>
        Offensive Power Rank: <span className="number">{context.elements["blueallianceOPR"][props.teamNum]}</span>
      </div>
      <div>
        Defensive Power Rank: <span className="number">{context.elements["blueallianceDPR"][props.teamNum]}</span>
      </div>

      <div style={{ marginTop: 20}}>
        <TeamGraph displays={graphDisplay} />
      </div>
    </li>
  )
}
