import React from 'react';
import { Teams, Elements, Match } from '../helpers/ConfigParser/types';

export const PrimaryContext = React.createContext<{ elements: Elements, teams: Teams }>({ elements: {}, teams: {} });
export const MatchContext = React.createContext<{ match: Match }>({
  match: {
    key: "",
    match_number: 0,
    alliances: {
      red: { team_keys: [] },
      blue: { team_keys: [] }
    },
    winning_alliance: "",
    post_result_time: 0
  }
});
