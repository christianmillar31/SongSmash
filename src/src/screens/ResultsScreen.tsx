import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import styled from 'styled-components/native';
import theme from '../theme';

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.large}px;
`;
const SongCard = styled.View`
  background-color: #fff;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  align-items: center;
`;
const SongTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 4px;
`;
const SongArtist = styled.Text`
  font-size: 16px;
  color: ${theme.colors.accent};
  margin-bottom: 8px;
`;
const TeamScoreCard = styled.View`
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const TeamName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.text};
`;
const TeamScore = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.accent};
`;
const ContinueButton = styled.TouchableOpacity`
  background-color: ${theme.colors.accent};
  padding: 16px;
  border-radius: 12px;
  margin-top: 32px;
`;
const ContinueButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`;

const ResultsScreen: React.FC = () => {
  // For demo, use dummy data. Replace with route.params in real app.
  const correctSong = {
    name: 'Song Title',
    artist: 'Artist Name',
    album: 'Album Name',
    artworkUrl: '',
  };
  const teamScores = [
    { team: { id: '1', name: 'Team A' }, score: 2 },
    { team: { id: '2', name: 'Team B' }, score: 1 },
  ];
  const isLastRound = false;

  const handleContinue = () => {
    // Advance to next round or finish
    // navigation logic here
  };

  return (
    <Container>
      <SongCard>
        <SongTitle>{correctSong.name}</SongTitle>
        <SongArtist>by {correctSong.artist}</SongArtist>
        <Text style={{ color: theme.colors.text, fontSize: 14 }}>{correctSong.album}</Text>
      </SongCard>
      <FlatList
        data={teamScores}
        keyExtractor={item => item.team.id}
        renderItem={({ item }) => (
          <TeamScoreCard>
            <TeamName>{item.team.name}</TeamName>
            <TeamScore>{item.score}</TeamScore>
          </TeamScoreCard>
        )}
      />
      <ContinueButton onPress={handleContinue}>
        <ContinueButtonText>{isLastRound ? 'Finish' : 'Continue'}</ContinueButtonText>
      </ContinueButton>
    </Container>
  );
};

export default ResultsScreen; 