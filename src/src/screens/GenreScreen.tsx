import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import theme from '../theme';
import { RootStackParamList } from '../types';

const genresList = [
  'Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Jazz', 'Classical', 'Country', 'R&B', 'Indie', 'Metal'
];
const decadesList = [
  '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'
];

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.large}px;
`;
const Section = styled.View`
  margin-bottom: ${theme.spacing.large}px;
`;
const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.medium}px;
`;
const ChipsRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: ${theme.spacing.medium}px;
`;
const Chip = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: ${props => props.selected ? theme.colors.accent : '#fff'};
  border: 1px solid ${theme.colors.accent};
  border-radius: 16px;
  margin: 4px;
  padding: 8px 18px;
`;
const ChipText = styled.Text<{ selected: boolean }>`
  color: ${props => props.selected ? '#fff' : theme.colors.accent};
  font-size: 16px;
  font-weight: 600;
`;
const NextButton = styled.TouchableOpacity<{ disabled: boolean }>`
  background-color: ${props => props.disabled ? theme.colors.background : theme.colors.accent};
  padding: ${theme.spacing.large}px;
  border-radius: ${theme.radii.medium}px;
  margin-top: auto;
  opacity: ${props => props.disabled ? 0.5 : 1};
`;
const NextButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
`;

const GenreScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { teams, difficultyRange } = (route.params || {}) as any;
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedDecades, setSelectedDecades] = useState<string[]>([]);
  const loading = false;

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };
  const toggleDecade = (decade: string) => {
    setSelectedDecades(prev =>
      prev.includes(decade) ? prev.filter(d => d !== decade) : [...prev, decade]
    );
  };

  const canProceed = selectedGenres.length > 0 || selectedDecades.length > 0;

  const handleNext = () => {
    if (!canProceed) return;
    navigation.navigate('Game', {
      teams,
      genres: selectedGenres,
      decades: selectedDecades,
      difficultyRange,
    });
  };

  return (
    <Container>
      <Section>
        <SectionTitle>Select Genre(s)</SectionTitle>
        <ChipsRow>
          {genresList.map(genre => (
            <Chip
              key={genre}
              selected={selectedGenres.includes(genre)}
              onPress={() => toggleGenre(genre)}
              activeOpacity={0.8}
            >
              <ChipText selected={selectedGenres.includes(genre)}>{genre}</ChipText>
            </Chip>
          ))}
        </ChipsRow>
      </Section>
      <Section>
        <SectionTitle>Select Decade(s)</SectionTitle>
        <ChipsRow>
          {decadesList.map(decade => (
            <Chip
              key={decade}
              selected={selectedDecades.includes(decade)}
              onPress={() => toggleDecade(decade)}
              activeOpacity={0.8}
            >
              <ChipText selected={selectedDecades.includes(decade)}>{decade}</ChipText>
            </Chip>
          ))}
        </ChipsRow>
      </Section>
      <NextButton disabled={!canProceed || loading} onPress={handleNext}>
        {loading ? <ActivityIndicator color={theme.colors.white} /> : <NextButtonText>Next</NextButtonText>}
      </NextButton>
    </Container>
  );
};

export default GenreScreen; 