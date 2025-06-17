import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
import { Audio } from 'expo-av';
import { useRoute } from '@react-navigation/native';
import styled from 'styled-components/native';
import theme from '../theme';

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;
const AlbumArt = styled.Image`
  width: 300px;
  height: 300px;
  border-radius: ${theme.radii.medium}px;
  align-self: center;
  margin-bottom: ${theme.spacing.large}px;
`;
const ControlsRow = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: ${theme.spacing.large}px;
`;
const PlayButton = styled.TouchableOpacity`
  background-color: ${theme.colors.accent};
  width: 60px;
  height: 60px;
  border-radius: 30px;
  justify-content: center;
  align-items: center;
`;
const ProgressSlider = styled.Slider`
  width: 100%;
  height: 40px;
`;
const Input = styled.TextInput`
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  margin-bottom: 12px;
`;
const ScoreboardSheet = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 16px;
  elevation: 8;
`;
const SheetHandle = styled.View`
  width: 40px;
  height: 5px;
  background-color: #ccc;
  border-radius: 3px;
  align-self: center;
  margin-bottom: 8px;
`;

const GameScreen: React.FC = () => {
  const route = useRoute<any>();
  const { teams, genres, decades, difficultyRange, tracks } = route.params || {};
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [songTitle, setSongTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [scoreboardOpen, setScoreboardOpen] = useState(false);
  const [scores, setScores] = useState(teams.map((t: any) => ({ team: t, score: 0 })));
  const progressRef = useRef<any>(null);

  const currentTrack = tracks[currentTrackIndex];

  // Audio logic
  const loadAudio = async () => {
    if (sound) {
      await sound.unloadAsync();
    }
    if (currentTrack?.previewUrl) {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: currentTrack.previewUrl },
        { shouldPlay: false, positionMillis: (currentTrack.snippetOffset || 0) * 1000 }
      );
      setSound(newSound);
      newSound.setOnPlaybackStatusUpdate((status: any) => {
        setIsPlaying(status.isPlaying);
        setPosition(status.positionMillis || 0);
        setDuration(currentTrack.snippetLength * 1000);
        if (status.positionMillis && status.positionMillis >= currentTrack.snippetLength * 1000) {
          newSound.pauseAsync();
        }
      });
    }
  };

  React.useEffect(() => {
    loadAudio();
    return () => { if (sound) sound.unloadAsync(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex]);

  const togglePlayPause = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const onSliderValueChange = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  // Scoreboard logic (simple running total for demo)
  const handleSubmit = () => {
    // For demo, just increment first team
    setScores(prev => prev.map((s, i) => i === 0 ? { ...s, score: s.score + 1 } : s));
    setSongTitle('');
    setArtist('');
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  };

  return (
    <Container>
      <AlbumArt source={{ uri: currentTrack?.artworkUrl }} resizeMode="cover" />
      <ControlsRow>
        <PlayButton onPress={togglePlayPause}>
          <Text style={{ color: '#fff', fontSize: 24 }}>{isPlaying ? '⏸️' : '▶️'}</Text>
        </PlayButton>
      </ControlsRow>
      <View style={{ marginHorizontal: 16 }}>
        <Text style={{ textAlign: 'center', color: theme.colors.text }}>
          {Math.floor(position / 1000)}s / {currentTrack?.snippetLength || 0}s
        </Text>
        <ProgressSlider
          ref={progressRef}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onValueChange={onSliderValueChange}
          minimumTrackTintColor={theme.colors.accent}
          maximumTrackTintColor="#ccc"
          thumbTintColor={theme.colors.accent}
        />
      </View>
      <View style={{ margin: 16 }}>
        <Input
          placeholder="Song Title"
          value={songTitle}
          onChangeText={setSongTitle}
        />
        <Input
          placeholder="Artist"
          value={artist}
          onChangeText={setArtist}
        />
        <TouchableOpacity
          style={{ backgroundColor: theme.colors.accent, borderRadius: 8, padding: 12, marginTop: 8 }}
          onPress={handleSubmit}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Submit</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{ alignSelf: 'center', marginBottom: 8 }}
        onPress={() => setScoreboardOpen(o => !o)}
      >
        <Text style={{ color: theme.colors.accent, fontWeight: 'bold' }}>
          {scoreboardOpen ? 'Hide' : 'Show'} Scoreboard
        </Text>
      </TouchableOpacity>
      {scoreboardOpen && (
        <ScoreboardSheet>
          <SheetHandle />
          <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>Scoreboard</Text>
          <FlatList
            data={scores}
            keyExtractor={item => item.team.id}
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontWeight: '600' }}>{item.team.name}</Text>
                <Text style={{ fontWeight: '600' }}>{item.score}</Text>
              </View>
            )}
          />
        </ScoreboardSheet>
      )}
    </Container>
  );
};

export default GameScreen; 
