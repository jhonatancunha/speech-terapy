import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import Voice, { SpeechErrorEvent, SpeechResultsEvent } from '@react-native-voice/voice';
import { Button, Icon, ProgressBar, Spinner, Text } from '@ui-kitten/components';
import { View } from 'react-native';
import { useArrayState } from '~/hooks/useArrayState';
import { compareTwoStrings } from '~/utils/string.utils';


export default function App() {
  const [isRecording, setRecording] = useState<boolean>(false)
  const [currentWordIdx, setCurrentWordIdx] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const results  = useArrayState<number>([])
  
  
  const TIMEOUT = 1000 * 60
  const words =  ["GOIABA", "ABOBRINHA", "FEIJOADA"];
  const currentWordFormatted = words?.[currentWordIdx]?.split("")?.join(" ")
  const progress = (100* currentWordIdx) / words.length
  

  const onSpeechError = (e: SpeechErrorEvent) => {
    setRecording(false);
  };

  const calculateMetric = (detectedWord: string) => {
    setCurrentWordIdx(prevState => {
      setRecording(false);
      const currentWord = words[prevState];

        
      if(!detectedWord) {
        results.actions.add(0)
      }else{
        const metrics = compareTwoStrings(currentWord.toLocaleLowerCase(), detectedWord.toLowerCase())
        results.actions.add(metrics)
      }

      const newState = prevState + 1;

      if(newState >= words.length){
        setIsFinished(true)
      }

      return newState;
    });
  }


  const onSpeechResults = (e: SpeechResultsEvent) => {
      calculateMetric(e?.value?.[0] ?? '');
  };

  const _startRecognizing = async () => {
    try {
      setRecording(true)
      await Voice.start('pt-BR');
      setTimeout(_stopRecognizing, TIMEOUT)
    } catch (e) {
      console.error("_startRecognizing", e);
      _stopRecognizing()
    }
  };

  const _stopRecognizing = async () => {
    try {
      setRecording(false);
      await Voice.stop();
      calculateMetric('');
    } catch (e) {
      console.error("_stopRecognizing", e);
    } finally {
      _clearState();
    }
  };

  const _clearState = () => {
    setRecording(false);
  };


  const averageMetrics = useMemo(() => {
    const sum = results.state.reduce((acc, curr) => acc + curr, 0);
    return sum / words.length
  }, [results.state])

  useEffect(() => {
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
  }, []);



  return (
    <SafeAreaView style={{
      padding: 20,
      height: '100%',
    }}>
      
      {!isFinished ? 
        <View style={{
          gap: 10
        }}>
          <Text>{currentWordIdx + 1}/{words.length}</Text>
          <ProgressBar progress={progress / 100}/>
        </View> 
      : null }

      <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text style={{textAlign: 'center'}} category="h4">{!isFinished ? currentWordFormatted : `Você acertou um total de ${(averageMetrics * 100).toFixed(2)}%`}</Text>
      
        {isRecording  ?  <Spinner status='primary' /> : null}
      </View>


      {!isRecording && !isFinished ? (
        <Button 
          onPress={_startRecognizing} 
          accessoryLeft={<Icon name={"mic-outline"} />}
        >
          Responder
        </Button>
      ) : null}
    </SafeAreaView>
  );
}

