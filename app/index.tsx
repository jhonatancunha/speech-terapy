import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';

import { SpeechErrorEvent, SpeechRecognizedEvent, SpeechResultsEvent } from '@react-native-voice/voice';
import Voice from "@react-native-voice/voice";
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';


export default function App() {
  const [recognized, setRecognized] = useState('');
  const [volume, setVolume] = useState('');
  const [error, setError] = useState('');
  const [end, setEnd] = useState('');
  const [started, setStarted] = useState('');
  const [results, setResults] = useState([]);
  const [partialResults, setPartialResults] = useState([]);




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
        await Voice.start('pt-BR');
      }
    } catch (e) {
      console.error("start", e);
    }
  };

  const _stopRecognizing = async () => {
    try {
      console.log('stoped');
      
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const _cancelRecognizing = async () => {
    try {
      await Voice.cancel();
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
    setStarted('');
    setResults([]);
    setPartialResults([]);
  };

  // const speak = () => {
  //   const thingToSay = 'Repita comigo: Abobrinha';
  //   Speech.speak(thingToSay, {
  //     language: 'pt',
  //   });
  // };

  useEffect(() => {
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to React Native Voice!</Text>
      <Text style={styles.instructions}>
        Press the button and start speaking.
      </Text>
      <Text style={styles.stat}>{`Started: ${started}`}</Text>
      <Text style={styles.stat}>{`Recognized: ${recognized}`}</Text>
      <Text style={styles.stat}>{`Volume: ${volume}`}</Text>
      <Text style={styles.stat}>{`Error: ${error}`}</Text>
      <Text style={styles.stat}>Results</Text>
      {results.map((result, index) => {
        return (
          <Text key={`result-${index}`} style={styles.stat}>
            {result}
          </Text>
        );
      })}
      <Text style={styles.stat}>Partial Results</Text>
      {partialResults.map((result, index) => {
        return (
          <Text key={`partial-result-${index}`} style={styles.stat}>
            {result}
          </Text>
        );
      })}
      <Text style={styles.stat}>{`End: ${end}`}</Text>
      {/* <TouchableHighlight onPress={_startRecognizing}>
        <Text style={styles.action}>Start Recognizing</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={_stopRecognizing}>
        <Text style={styles.action}>Stop Recognizing</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={_cancelRecognizing}>
        <Text style={styles.action}>Cancel</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={_destroyRecognizer}>
        <Text style={styles.action}>Destroy</Text>
      </TouchableHighlight> */}

      <Button>
        <Text>Default</Text>
      </Button>

    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  action: {
    textAlign: 'center',
    color: '#0000FF',
    marginVertical: 5,
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  stat: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
  },
});