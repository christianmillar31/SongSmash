import React, { useState } from 'react';
import { FlatList, Modal, View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useTeams, Team } from '../context/TeamContext';
import theme from '../theme';

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.medium}px;
`;

const Card = styled.TouchableOpacity<{ color?: string }>`
  background-color: ${({ color }) => color || '#fff'};
  border-radius: ${theme.radii.medium}px;
  padding: ${theme.spacing.medium}px;
  margin: ${theme.spacing.small / 2}px;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  elevation: 2;
`;

const CardText = styled.Text`
  color: ${theme.colors.text};
  font-size: 16px;
  font-weight: 600;
`;

const AddCard = styled(Card)`
  border: 2px dashed ${theme.colors.accent};
  background-color: #f0f0f0;
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0,0,0,0.3);
`;

const ModalContent = styled.View`
  background-color: #fff;
  padding: 24px;
  border-radius: 16px;
  width: 90%;
`;

const Input = styled.TextInput`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 12px;
  font-size: 16px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 8px;
`;

const Button = styled.TouchableOpacity`
  padding: 8px 16px;
  border-radius: 8px;
  background-color: ${theme.colors.accent};
  margin-left: 8px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-weight: 600;
`;

const TeamsScreen: React.FC = () => {
  const { teams, addTeam, editTeam, removeTeam } = useTeams();
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [colorHex, setColorHex] = useState('');

  const openNewTeamModal = () => {
    setEditMode(false);
    setSelectedTeam(null);
    setName('');
    setAvatarUrl('');
    setColorHex('');
    setModalVisible(true);
  };

  const openEditModal = (team: Team) => {
    setEditMode(true);
    setSelectedTeam(team);
    setName(team.name);
    setAvatarUrl(team.avatarUrl || '');
    setColorHex(team.colorHex || '');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    if (editMode && selectedTeam) {
      await editTeam({ ...selectedTeam, name, avatarUrl, colorHex });
    } else {
      await addTeam({
        id: Date.now().toString(),
        name,
        avatarUrl: avatarUrl || undefined,
        colorHex: colorHex || undefined,
      });
    }
    setModalVisible(false);
  };

  const handleDelete = async () => {
    if (selectedTeam) {
      await removeTeam(selectedTeam.id);
      setModalVisible(false);
    }
  };

  const renderItem = ({ item }: { item: Team }) => (
    <Card color={item.colorHex} onPress={() => openEditModal(item)}>
      {item.avatarUrl ? (
        <View style={{ marginBottom: 8 }}>
          <Text>🖼️</Text>
        </View>
      ) : null}
      <CardText>{item.name}</CardText>
    </Card>
  );

  return (
    <Container>
      <FlatList
        data={[...teams, { id: 'new', name: '+ New Team' } as Team]}
        renderItem={({ item }) =>
          item.id === 'new' ? (
            <AddCard onPress={openNewTeamModal}>
              <CardText>+ New Team</CardText>
            </AddCard>
          ) : (
            renderItem({ item })
          )
        }
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={{ gap: theme.spacing.medium }}
        columnWrapperStyle={{ gap: theme.spacing.medium }}
      />
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <ModalContainer>
          <ModalContent>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>
              {editMode ? 'Edit Team' : 'New Team'}
            </Text>
            <Input
              placeholder="Team Name"
              value={name}
              onChangeText={setName}
            />
            <Input
              placeholder="Avatar URL (optional)"
              value={avatarUrl}
              onChangeText={setAvatarUrl}
            />
            <Input
              placeholder="Color Hex (optional)"
              value={colorHex}
              onChangeText={setColorHex}
            />
            <ButtonRow>
              {editMode && (
                <Button style={{ backgroundColor: '#e74c3c' }} onPress={handleDelete}>
                  <ButtonText>Delete</ButtonText>
                </Button>
              )}
              <Button onPress={() => setModalVisible(false)} style={{ backgroundColor: '#ccc' }}>
                <ButtonText style={{ color: '#333' }}>Cancel</ButtonText>
              </Button>
              <Button onPress={handleSave}>
                <ButtonText>{editMode ? 'Save' : 'Add'}</ButtonText>
              </Button>
            </ButtonRow>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </Container>
  );
};

export default TeamsScreen; 