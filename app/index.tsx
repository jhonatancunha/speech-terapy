import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';

import { SpeechErrorEvent, SpeechRecognizedEvent, SpeechResultsEvent } from '@react-native-voice/voice';
import Voice from "@react-native-voice/voice";
import { Button, Icon, Layout, Spinner, Text } from '@ui-kitten/components';


export default function App() {
  const [recognized, setRecognized] = useState('');
  const [volume, setVolume] = useState('');
  const [error, setError] = useState('');
  const [end, setEnd] = useState('');
  const [results, setResults] = useState([]);
  const [partialResults, setPartialResults] = useState([]);
  const [isRecording, setRecording] = useState(false)



  const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    console.log('onSpeechRecognized: ', e);
    setRecognized('√');
  };


  const onSpeechError = (e: SpeechErrorEvent) => {
    console.log('onSpeechError: ', e);
    setError(JSON.stringify(e.error));
  };

  const onSpeechResults = (e: SpeechResultsEvent) => {
    console.log('onSpeechResults: ', e);
    setResults(e.value);
  };

  const onSpeechPartialResults = (e: SpeechResultsEvent) => {
    console.log('onSpeechPartialResults: ', e);
    setPartialResults(e.value);
  };


  const _startRecognizing = async () => {
    _clearState();
    try {
      if(await Voice.isRecognizing()){
        _stopRecognizing()
      }else{
        console.log('called start');
        setRecording(true)
        await Voice.start('pt-BR');
      }
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

  const _cancelRecognizing = async () => {
    try {
      await Voice.cancel();
      setRecording(false);
    } catch (e) {
      console.error(e);
    }
  };

  const _destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    _clearState();
  };

  const _clearState = () => {
    setRecognized('');
    setVolume('');
    setError('');
    setEnd('');
    setResults([]);
    setPartialResults([]);
    setRecording(false);
  };


  useEffect(() => {
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
  }, []);

  return (
    <View>

     
      <Text category="h4">Resultados Parciais</Text>
      {partialResults.map((result, index) => {
        return (
          <Text key={`partial-result-${index}`}>
            {result}
          </Text>
        );
      })}


      <Button onPress={() => {
        if(isRecording){
          _stopRecognizing()
        }else{
          _startRecognizing()
        }
      }} accessoryLeft={<Icon name={isRecording ? "stop-circle-outline" : "mic-outline"} />}>
        {isRecording ? "Gravando" : "Gravar"}
      </Button>

      <Text category="h4">Resultados Finais</Text>

      {isRecording  ?  <Spinner status='primary' /> : null}


      {results.map((result, index) => {
        return (
          <Text key={`result-${index}`}>
            {result}
          </Text>
        );
      })}
    </View>
  );
}

