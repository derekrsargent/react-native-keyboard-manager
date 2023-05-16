import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TurboModuleRegistry,
  View,
} from 'react-native';
import { KeyboardManager } from 'react-native-keyboard-manager';

export default function App() {
  const [isKeyboardShown, setIsKeyboardShown] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [text, onChangeText] = useState('Press here to start typing');
  const [isTurboModule, setIsTurboModule] = useState(false);

  useEffect(() => {
    try {
      /* 
      The `__turboModuleProxy` property only exists on a Turbo Module, but when
      it does exist it returns `undefined`, how about that!?
      */
      const MyTurboModule = TurboModuleRegistry.getEnforcing('KeyboardManager');
      //@ts-expect-error
      MyTurboModule.__turboModuleProxy;
      setIsTurboModule(true);
    } catch (e) {
      setIsTurboModule(false);
    }
  }, []);

  const isIos = Platform.OS === 'ios';

  useEffect(() => {
    KeyboardManager.didKeyboardShow((event: any) => {
      setIsKeyboardShown(true);
      setKeyboardHeight(event?.keyboardHeight || 0);
    });

    KeyboardManager.didKeyboardDismiss(() => {
      setIsKeyboardShown(false);
    });

    return () => KeyboardManager.removeAllListeners();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.text}>
            This app is using
            {isTurboModule ? ' Turbo Modules' : ' Native Modules'}
          </Text>
          <Text style={styles.title}>
            Keyboard is
            {isKeyboardShown
              ? ` shown and its height is ${keyboardHeight} px.`
              : ' dismissed!'}
          </Text>
          {isIos && (
            <Text style={styles.text}>
              Reminder to set 'Toggle Software Keyboard' (⌘K) if keyboard does
              not display when text input is active
            </Text>
          )}
          <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            value={text}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50,
  },
  input: {
    width: 300,
    height: 40,
    marginTop: 50,
    borderWidth: 1,
    padding: 10,
    textAlign: 'center',
    borderRadius: 10,
  },
  title: {
    height: 80,
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    textAlign: 'center',
    color: 'grey',
    fontWeight: 'bold',
    margin: 20,
  },
});
