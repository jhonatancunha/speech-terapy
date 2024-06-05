import { Button, Icon, Text } from '@ui-kitten/components';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WordsLevelsEnum } from '~/utils/enums.utils';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

export default function App() {
  const handlePress = (difficulty: WordsLevelsEnum) => {
    router.navigate({ pathname: 'game', params: { difficulty } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text category="h1" numberOfLines={1} style={styles.header}>
        Dificuldade
      </Text>
      <Button
        style={styles.button}
        onPress={() => handlePress(WordsLevelsEnum.EASY)}
        status="success"
        appearance="outline"
        accessoryRight={<Icon name="star" />}>
        Fácil
      </Button>
      <Button
        style={styles.button}
        onPress={() => handlePress(WordsLevelsEnum.MEDIUM)}
        status="basic"
        appearance="outline"
        accessoryRight={<Icon name="cube-outline" />}>
        Médio
      </Button>
      <Button
        style={styles.button}
        onPress={() => handlePress(WordsLevelsEnum.HARD)}
        status="warning"
        appearance="outline"
        accessoryRight={<Icon name="alert-triangle-outline" />}>
        Difícil
      </Button>
      <Button
        style={styles.button}
        onPress={() => handlePress(WordsLevelsEnum.HARDER)}
        status="danger"
        appearance="outline"
        accessoryRight={<Icon name="award-outline" />}>
        Muito difícil
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  button: {
    marginVertical: 16,
    width: '80%',
  },
});
