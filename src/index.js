import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import './config/ReactotronConfig';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#333',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFF',
    fontSize: 40,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>My APP</Text>
    </View>
  );
}
