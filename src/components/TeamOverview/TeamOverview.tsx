import React, { useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Teams, Elements } from '../../helpers/ConfigParser/types';
import { PrimaryContext} from '../contexts';
import { MatchTable } from '../MatchTable';
import './TeamOverview.css'
import { SheetTable } from '../SheetTable';

interface TeamOverviewProps {
  teamNum: string;
}

export const TeamOverview = (props: RouteComponentProps<TeamOverviewProps>): JSX.Element => {
  const teamNum = parseInt(props.match.params.teamNum);

  const primaryContext: {elements: Elements, teams: Teams} = useContext(PrimaryContext);
  const team = primaryContext.teams[teamNum];

  const list: Array<JSX.Element> = team.displays.list.map<JSX.Element>((listDisplay) => {
    return (<h3 key={listDisplay.title}>{`${listDisplay.title}: ${listDisplay.value}`}</h3>)
  })

  return (
    <div className="TeamOverview" style={{borderRadius: '5px'}}>
      <div className="vertical-flex">
        <div className="horizontal-flex">
          <div>
            <h1 style={{ fontWeight: 1000 }}>{`${teamNum} - ${team.name}`}</h1>
            {list}
          </div>
          <div>
            <MatchTable matches={team.displays["matches"]} />
          </div>
        </div>
        <SheetTable teamNum={teamNum} />
      </div>
    </div>
  )
}
