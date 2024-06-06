/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';
import { Button, Card, Icon, ProgressBar, Text } from '@ui-kitten/components';
import { View } from 'react-native';
import { useArrayState } from '~/hooks/useArrayState';
import { compareTwoStrings, getWordsByDifficulty } from '~/utils/string.utils';
import { useBoolean } from '~/hooks/useBooleanState/useBooleanState.hook';
import LottieView from 'lottie-react-native';
import HappyLottie from '../assets/lotties/happy.json';
import BadLottie from '../assets/lotties/bad.json';
import RecordingLottie from '../assets/lotties/recording.json';
import { router, useLocalSearchParams } from 'expo-router';

export default function App(): React.JSX.Element {
  const TOTAL_WORDS = 10;
  const TIMEOUT = 1000 * 60;

  const { difficulty } = useLocalSearchParams();

  const [currentWordIdx, setCurrentWordIdx] = useState<number>(0);
  const [detectedWord, setDetectedWord] = useState<string>('');

  const isRecording = useBoolean(false);
  const isFinished = useBoolean(false);
  const showFeedback = useBoolean(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const results = useArrayState<number>([]);

  const selectedWords = useMemo(
    () => getWordsByDifficulty(TOTAL_WORDS, parseInt(difficulty as string, 10)),
    [difficulty],
  );

  const currentWordFormatted = selectedWords[currentWordIdx]
    ?.split('')
    ?.join(' ')
    .toUpperCase();
  const progress = (100 * currentWordIdx) / TOTAL_WORDS;

  const onSpeechError = (): void => {
    isRecording.actions.setValue(false);
  };

  const calculateMetric = (wordDetected: string): void => {
    setDetectedWord(wordDetected);
    setCurrentWordIdx((prevState) => {
      isRecording.actions.setValue(false);
      const currentWord = selectedWords[prevState];

      if (!wordDetected) {
        results.actions.add(0);
      } else {
        const metrics = compareTwoStrings(
          currentWord.toLocaleLowerCase(),
          wordDetected.toLowerCase(),
        );
        results.actions.add(metrics);
      }

      const newState = prevState + 1;

      if (newState >= TOTAL_WORDS) {
        isFinished.actions.setValue(true);
      } else {
        showFeedback.actions.setTrue();
      }

      return newState;
    });
  };

  const onSpeechResults = (e: SpeechResultsEvent): void => {
    const word = e?.value?.[0];
    if (!word && !word?.length) {
      isRecording.actions.setValue(false);
    } else {
      calculateMetric(e?.value?.[0] ?? '');
    }
  };

  const startRecognizing = async (): Promise<void> => {
    try {
      isRecording.actions.setValue(true);
      await Voice.start('pt-BR');

      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      timeout.current = setTimeout(stopRecognizing, TIMEOUT);
    } catch (e) {
      stopRecognizing();
    }
  };

  const stopRecognizing = async (): Promise<void> => {
    try {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      isRecording.actions.setValue(false);
      await Voice.stop();
      calculateMetric('');
    } catch (e) {
      console.error('_stopRecognizing', e);
    }
  };

  const restartGame = (): void => {
    setDetectedWord('');
    setCurrentWordIdx(0);
    isRecording.actions.setFalse();
    isFinished.actions.setFalse();
    showFeedback.actions.setFalse();
    results.actions.setData([]);
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    router.navigate({ pathname: '/' });
  };

  const averageMetrics = useMemo(() => {
    const sum = results.state.reduce((acc, curr) => acc + curr, 0);
    return sum / TOTAL_WORDS;
  }, [results.state]);

  useEffect(() => {
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderFeedback = (): React.JSX.Element => {
    const currentResult = results.state?.[currentWordIdx - 1] * 100;
    const currentWord = selectedWords[currentWordIdx - 1];
    const animation = currentResult === 100 ? HappyLottie : BadLottie;

    return (
      <>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            marginTop: '20%',
          }}>
          <Card
            status="success"
            style={{
              display: 'flex',
              width: '100%',
            }}>
            <Text style={{ textAlign: 'center', marginBottom: 4 }}>
              Original:
            </Text>
            <Text
              category={`h${Number(difficulty) + 1}`}
              numberOfLines={1}
              style={{ textAlign: 'center' }}>
              {currentWord?.toUpperCase()}
            </Text>
          </Card>

          <Card
            status="warning"
            style={{
              display: 'flex',
              marginTop: 18,
              width: '100%',
            }}>
            <Text style={{ textAlign: 'center', marginBottom: 4 }}>
              Detectada:
            </Text>
            <Text
              category={`h${Number(difficulty) + 1}`}
              numberOfLines={1}
              style={{ textAlign: 'center' }}>
              {detectedWord?.toUpperCase()}
            </Text>
          </Card>

          <View style={{ marginTop: '15%' }}>
            <LottieView
              autoPlay
              style={{
                width: 200,
                height: 200,
              }}
              source={animation}
            />
          </View>
        </View>

        <Button
          onPress={showFeedback.actions.setFalse}
          accessoryLeft={<Icon name={'play-circle-outline'} />}>
          CONTINUAR
        </Button>
      </>
    );
  };

  const renderContent = (): React.JSX.Element => (
    <>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{ textAlign: 'center', fontSize: 13 }}>PALAVRA</Text>
        <Text
          style={{
            textAlign: 'center',
          }}
          category={`h${Number(difficulty) + 1}`}>
          {!isFinished.value
            ? currentWordFormatted
            : `Você acertou um total de ${(averageMetrics * 100).toFixed(2)}%`}
        </Text>

        {isRecording.value ? (
          <LottieView
            autoPlay
            style={{
              width: 60,
              height: 60,
            }}
            source={RecordingLottie}
          />
        ) : null}
      </View>

      {!isRecording.value && !isFinished.value ? (
        <Button
          onPress={startRecognizing}
          accessoryLeft={<Icon name={'mic-outline'} />}>
          RESPONDER
        </Button>
      ) : null}

      {isFinished.value ? (
        <Button
          onPress={restartGame}
          accessoryLeft={<Icon name={'sync-outline'} />}>
          JOGAR NOVAMENTE
        </Button>
      ) : null}
    </>
  );

  return (
    <SafeAreaView
      style={{
        padding: 20,
        height: '100%',
      }}>
      {!isFinished.value ? (
        <View
          style={{
            gap: 10,
          }}>
          <Text>
            {currentWordIdx + 1}/{TOTAL_WORDS}
          </Text>
          <ProgressBar progress={progress / 100} />
        </View>
      ) : null}

      {showFeedback.value ? renderFeedback() : renderContent()}
    </SafeAreaView>
  );
}
