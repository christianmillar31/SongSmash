import React, { useState } from 'react';
import { FlatList, Text } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTeams, Team } from '../context/TeamContext';
import theme from '../theme';
import { RootStackParamList } from '../types';

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.medium}px;
`;

const Card = styled.TouchableOpacity<{ selected: boolean; color?: string }>`
  background-color: ${({ selected, color }) =>
    selected ? theme.colors.accent : color || '#fff'};
  border-radius: ${theme.radii.medium}px;
  padding: ${theme.spacing.medium}px;
  margin: ${theme.spacing.small / 2}px;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  elevation: 2;
  border-width: ${({ selected }) => (selected ? '2px' : '0px')};
  border-color: ${theme.colors.accent};
`;

const CardText = styled.Text<{ selected: boolean }>`
  color: ${({ selected }) => (selected ? '#fff' : theme.colors.text)};
  font-size: 16px;
  font-weight: 600;
`;

const NextButton = styled.TouchableOpacity<{ enabled: boolean }>`
  background-color: ${({ enabled }) =>
    enabled ? theme.colors.accent : theme.colors.background};
  padding: ${theme.spacing.medium}px;
  border-radius: ${theme.radii.medium}px;
  margin-top: auto;
  opacity: ${({ enabled }) => (enabled ? 1 : 0.5)};
`;

const NextButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
`;

const TeamSelectScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { teams } = useTeams();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleTeam = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(tid => tid !== id) : prev.length < 2 ? [...prev, id] : prev
    );
  };

  const canProceed = selected.length === 2;

  const handleNext = () => {
    if (!canProceed) return;
    const selectedTeams = teams.filter(t => selected.includes(t.id));
    navigation.navigate('DifficultyScreen', { teams: selectedTeams });
  };

  return (
    <Container>
      <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 16 }}>Select Two Teams</Text>
      <FlatList
        data={teams}
        renderItem={({ item }) => (
          <Card
            selected={selected.includes(item.id)}
            color={item.colorHex}
            onPress={() => toggleTeam(item.id)}
          >
            <CardText selected={selected.includes(item.id)}>{item.name}</CardText>
          </Card>
        )}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={{ gap: theme.spacing.medium }}
        columnWrapperStyle={{ gap: theme.spacing.medium }}
      />
      <NextButton enabled={canProceed} onPress={handleNext} disabled={!canProceed}>
        <NextButtonText>Next</NextButtonText>
      </NextButton>
    </Container>
  );
};

export default TeamSelectScreen; 