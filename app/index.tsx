import React, { useEffect, useMemo, useRef, useState } from 'react';

import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';
import { Button, Icon, ProgressBar, Text } from '@ui-kitten/components';
import LottieView from 'lottie-react-native';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BadLottie from '../assets/lotties/bad.json';
import HappyLottie from '../assets/lotties/happy.json';
import RecordingLottie from '../assets/lotties/recording.json';

import { words } from '~/assets/words';
import { useArrayState } from '~/hooks/useArrayState';
import { generateRandomIndices } from '~/utils/array.utils';
import { compareTwoStrings } from '~/utils/string.utils';
import { useBoolean } from '~/hooks/useBooleanState/useBooleanState.hook';

export default function App() {
  const TOTAL_WORDS = 15;
  const TIMEOUT = 1000 * 60;

  const [currentWordIdx, setCurrentWordIdx] = useState<number>(0);
  const [detectedWord, setDetectedWord] = useState<string>('');
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>(
    generateRandomIndices(TOTAL_WORDS, 0, words.length),
  );

  const isRecording = useBoolean(false);
  const isFinished = useBoolean(false);
  const showFeedback = useBoolean(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const results = useArrayState<number>([]);

  const selectedWords = useMemo(
    () => selectedIndexes.map((index) => words[index]),
    [selectedIndexes],
  );

  const currentWordFormatted = selectedWords[currentWordIdx]
    ?.split('')
    ?.join(' ')
    .toUpperCase();
  const progress = (100 * currentWordIdx) / TOTAL_WORDS;

  const onSpeechError = () => {
    isRecording.actions.setValue(false);
  };

  const calculateMetric = (detectedWord: string) => {
    setDetectedWord(detectedWord);
    setCurrentWordIdx((prevState) => {
      isRecording.actions.setValue(false);
      const currentWord = selectedWords[prevState];

      if (!detectedWord) {
        results.actions.add(0);
      } else {
        const metrics = compareTwoStrings(
          currentWord.toLocaleLowerCase(),
          detectedWord.toLowerCase(),
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

  const onSpeechResults = (e: SpeechResultsEvent) => {
    const word = e?.value?.[0];
    if (!word && !word?.length) {
      isRecording.actions.setValue(false);
    } else {
      calculateMetric(e?.value?.[0] ?? '');
    }
  };

  const startRecognizing = async () => {
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

  const stopRecognizing = async () => {
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

  const restartGame = () => {
    setSelectedIndexes(generateRandomIndices(TOTAL_WORDS, 0, words.length));
    setDetectedWord('');
    setCurrentWordIdx(0);
    isRecording.actions.setFalse();
    isFinished.actions.setFalse();
    showFeedback.actions.setFalse();
    results.actions.setData([]);
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  };

  const averageMetrics = useMemo(() => {
    const sum = results.state.reduce((acc, curr) => acc + curr, 0);
    return sum / TOTAL_WORDS;
  }, [results.state]);

  useEffect(() => {
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderFeedback = () => {
    const currentResult = results.state?.[currentWordIdx - 1] * 100;
    const currentWord = selectedWords[currentWordIdx - 1];
    const animation = currentResult > 50 ? HappyLottie : BadLottie;

    return (
      <>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {/* <Text category="h4">
          Rsultado: {currentResult?.toFixed(2)}%
        </Text> */}
          <Text category="h4">Original: {currentWord?.toLowerCase()}</Text>
          <Text category="h4">Detectada: {detectedWord?.toLowerCase()}</Text>

          <View style={{ marginTop: 50 }}>
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

  const renderContent = () => (
    <>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{ textAlign: 'center', fontSize: 13 }}>PALAVRA</Text>
        <Text style={{ textAlign: 'center' }} category="h4">
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
          accessoryLeft={<Icon name={'mic-outline'} />}>
          RECOMEÇAR
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
