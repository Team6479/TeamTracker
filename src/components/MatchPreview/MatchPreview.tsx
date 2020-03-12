import React, { useContext } from 'react';
import { MatchesContext } from '../contexts';
import { TeamPreviw } from '../TeamPreview/TeamPreview';
import { RouteComponentProps } from 'react-router-dom';
import { Matches } from '../../helpers/ConfigParser/types';
import './MatchPreview.css'
import { getCompLevelTitle } from '../../helpers/match';

interface MatchPreviewProps {
  matchKey: string;
}

function getTeams(team_keys: Array<string>): Array<JSX.Element> {
  var teams = [];
  for (const team of team_keys) {
    const teamNum = parseInt(team.substring(3));  // substring(3) strips out the 'frc' prefix in the key
    teams.push((<TeamPreviw teamNum={teamNum} key={teamNum}/>));
  }
  return teams;
}

export const MatchPreview = (props: RouteComponentProps<MatchPreviewProps>): JSX.Element => {
  const matchesContext: Matches = useContext(MatchesContext);

  return (
    <div className="MatchPreview">
    <h1>{`${getCompLevelTitle(matchesContext[props.match.params.matchKey].comp_level)} ${matchesContext[props.match.params.matchKey].match_number}`}</h1>
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
