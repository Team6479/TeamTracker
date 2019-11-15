import React from 'react';
import { Teams, Elements } from '../helpers/ConfigParser/types';

export const PrimaryContext = React.createContext<{elements: Elements, teams: Teams}>({elements: {}, teams: {}});

