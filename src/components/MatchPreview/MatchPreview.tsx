import './MatchPreview.css'
import React, { useContext } from 'react';
import { MatchesContext } from '../contexts';
import { TeamPreviw } from '../TeamPreview/TeamPreview';
import { RouteComponentProps } from 'react-router-dom';
import { Matches } from '../../helpers/ConfigParser/types';

interface MatchPreviewProps {
  matchKey: string;
}

export const MatchPreview: React.FC<RouteComponentProps<MatchPreviewProps>> = (props) => {
  const matchesContext: Matches = useContext(MatchesContext);

  function getTeams(team_keys: Array<string>): Array<JSX.Element> {
    var teams = [];
    for (const team of team_keys) {
      const teamNum = parseInt(team.substring(3));  // substring(3) strips out the 'frc' prefix in the key
      teams.push((<TeamPreviw teamNum={teamNum} key={teamNum}/>));
    }
    return teams;
  }

  return (
    <div className="MatchPreview">
      <ul className='list red'>
        {getTeams(matchesContext[props.match.params.matchKey].alliances.red.team_keys)}
      </ul>
      <hr/>
      <ul className='list blue'>
        {getTeams(matchesContext[props.match.params.matchKey].alliances.blue.team_keys)}
      </ul>
    </div>
  )
}
