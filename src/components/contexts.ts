import React from 'react';
import { Teams, Elements, Matches } from '../helpers/ConfigParser/types';

export const PrimaryContext = React.createContext<{ elements: Elements, teams: Teams }>({ elements: {}, teams: {} });
export const MatchesContext = React.createContext<Matches>({});
