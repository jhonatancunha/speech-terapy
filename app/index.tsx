import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import Voice, { SpeechErrorEvent, SpeechResultsEvent } from '@react-native-voice/voice';
import { Button, Icon, ProgressBar, Spinner, Text } from '@ui-kitten/components';
import { View } from 'react-native';


export default function App() {
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);
  const [isRecording, setRecording] = useState<boolean>(false)




  const onSpeechError = (e: SpeechErrorEvent) => {
    console.log('onSpeechError: ', e);
    setError(JSON.stringify(e.error));
    setRecording(false);
  };

  const onSpeechResults = (e: SpeechResultsEvent) => {
    console.log('onSpeechResults: ', e);
    setResults(e.value);
    setRecording(false);
  };

  const _startRecognizing = async () => {
    _clearState();

    try {
      const isRecognizing = await Voice.isRecognizing()

      if(isRecognizing) await _stopRecognizing()
        
      console.log('called start');
      setRecording(true)
      await Voice.start('pt-BR');
    } catch (e) {
      console.error("start", e);
    }
  };

  const _stopRecognizing = async () => {
    try {
      console.log('stoped');
      
      setRecording(false)
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const _clearState = () => {
    setError('');
    setResults([]);
    setRecording(false);
  };


  useEffect(() => {
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
  }, []);

  return (
    <SafeAreaView style={{
      padding: 20,
      height: '100%',
    }}>
      
      <ProgressBar progress={0.8}/>

      <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text category="h4">G O I A B A</Text>
      


        {/* <Text category="h4">Resultados Finais</Text> */}

        {isRecording  ?  <Spinner status='primary' /> : null}
      </View>


      {!isRecording ? (
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

