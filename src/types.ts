import { Team } from './src/context/TeamContext';

export type RootStackParamList = {
  DifficultyScreen: { teams: Team[] };
  Genre: { teams: Team[]; difficultyRange: [string, string] };
  Game: {
    teams: Team[];
    genres: string[];
    decades: string[];
    difficultyRange: [string, string];
  };
};
