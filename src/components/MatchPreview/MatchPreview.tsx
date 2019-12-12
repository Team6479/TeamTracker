import './MatchPreview.css'
import React, { useContext } from 'react';
import { MatchContext} from '../contexts';
import { TeamPreviw } from '../TeamPreview/TeamPreview';

export const MatchPreview: React.FC = () => {
  const matchContext = useContext(MatchContext);

  function getTeams(team_keys: Array<string>): Array<JSX.Element> {
    var teams = [];
    for (const team of team_keys) {
      const teamNum = parseInt(team.substring(3));
      teams.push((<TeamPreviw teamNum={teamNum} key={teamNum}/>));
    }
    return teams;
  }

  return (
    <div className="MatchPreview">
      <ul className='list red'>
        {getTeams(matchContext.match.alliances.red.team_keys)}
      </ul>
      <hr/>
      <ul className='list blue'>
        {getTeams(matchContext.match.alliances.blue.team_keys)}
      </ul>
    </div>
  )
}
