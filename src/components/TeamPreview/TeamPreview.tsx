import './TeamPreview.css'
import React from 'react';
import { Link } from 'react-router-dom';
import { TeamsContext } from '../contexts';
import { Teams } from '../../helpers/ConfigParser/types';
import { TeamGraph } from '../TeamGraph';

interface TeamPreviewProps {
  teamNum: number
}

export const TeamPreviw: React.FC<TeamPreviewProps> = (props): JSX.Element => {

  function renderPreview(teams: Teams) {
    let team = teams[props.teamNum];
    let graphDisplay = team.displays.graph

    return(
      <div>
        <div>
          <h3><Link to={`/team/${props.teamNum}`}>{ `${props.teamNum} - ${team.name}`}</Link></h3>
        </div>
        <div>
          Blue Alliance Rank:  <span className="number">Rank</span>
        </div>
        <div>
          Offensive Power Rank: <span className="number">OPR</span>
        </div>
        <div>
          Defensive Power Rank: <span className="number">DPR</span>
        </div>

        <div style={{ marginTop: 20}}>
          <TeamGraph displays={graphDisplay} />
        </div>

        {/* TODO: Make this not a placeholder */}
        <div className="compare">
          <button className=''>
            Compare
          </button>
        </div>
      </div>

    )
  }

  return (
    <li className="TeamPreview">
      <TeamsContext.Consumer>
        {value => renderPreview(value)}
      </TeamsContext.Consumer>
    </li>
  )
}
