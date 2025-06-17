import React, { useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import theme from '../theme';
import { RootStackParamList } from '../../types';

const DIFFICULTY_LABELS = ['easy', 'medium', 'hard', 'expert'] as const;
type Difficulty = typeof DIFFICULTY_LABELS[number];

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.large}px;
  justify-content: center;
`;
const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  text-align: center;
  margin-bottom: ${theme.spacing.large}px;
`;
const RangeText = styled.Text`
  font-size: 18px;
  color: ${theme.colors.accent};
  text-align: center;
  margin-bottom: ${theme.spacing.medium}px;
`;
const NextButton = styled.TouchableOpacity<{ enabled: boolean }>`
  background-color: ${({ enabled }) =>
    enabled ? theme.colors.accent : theme.colors.background};
  padding: ${theme.spacing.large}px;
  border-radius: ${theme.radii.medium}px;
  margin-top: ${theme.spacing.large}px;
  opacity: ${({ enabled }) => (enabled ? 1 : 0.5)};
`;
const NextButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`;

const DifficultyScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [range, setRange] = useState<[number, number]>([1, 4]);

  const minLabel = DIFFICULTY_LABELS[range[0] - 1];
  const maxLabel = DIFFICULTY_LABELS[range[1] - 1];

  const handleNext = () => {
    navigation.navigate('Genre', {
      difficultyRange: [minLabel, maxLabel] as [Difficulty, Difficulty],
    });
  };

  return (
    <Container>
      <Title>Select Difficulty Range</Title>
      <RangeText>
        Difficulty: {minLabel.charAt(0).toUpperCase() + minLabel.slice(1)} to {maxLabel.charAt(0).toUpperCase() + maxLabel.slice(1)}
      </RangeText>
      <MultiSlider
        values={range}
        min={1}
        max={4}
        step={1}
        allowOverlap={false}
        snapped
        onValuesChange={vals => setRange([vals[0], vals[1]])}
        selectedStyle={{ backgroundColor: theme.colors.accent }}
        markerStyle={{ backgroundColor: theme.colors.accent }}
        containerStyle={{ marginHorizontal: 16 }}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
        {DIFFICULTY_LABELS.map((label) => (
          <RangeText key={label} style={{ fontSize: 14, color: theme.colors.text }}>
            {label.charAt(0).toUpperCase() + label.slice(1)}
          </RangeText>
        ))}
      </View>
      <NextButton enabled onPress={handleNext}>
        <NextButtonText>Next</NextButtonText>
      </NextButton>
    </Container>
  );
};

export default DifficultyScreen; 
