import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Team = {
  id: string;
  name: string;
  avatarUrl?: string;
  colorHex?: string;
};

interface TeamContextValue {
  teams: Team[];
  addTeam: (team: Team) => Promise<void>;
  editTeam: (team: Team) => Promise<void>;
  removeTeam: (id: string) => Promise<void>;
}

const TeamContext = createContext<TeamContextValue | undefined>(undefined);
const STORAGE_KEY = '@SongSmash:teams';

export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setTeams(JSON.parse(stored));
    })();
  }, []);

  const persist = async (newTeams: Team[]) => {
    setTeams(newTeams);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTeams));
  };

  const addTeam = async (team: Team) => {
    await persist([...teams, team]);
  };

  const editTeam = async (team: Team) => {
    await persist(teams.map(t => (t.id === team.id ? team : t)));
  };

  const removeTeam = async (id: string) => {
    await persist(teams.filter(t => t.id !== id));
  };

  return (
    <TeamContext.Provider value={{ teams, addTeam, editTeam, removeTeam }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeams = () => {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error('useTeams must be used within a TeamProvider');
  return ctx;
}; 