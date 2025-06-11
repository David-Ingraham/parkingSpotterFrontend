import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function DirectSearchScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.text}>Direct Search Screen (Coming Soon)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
    backgroundColor: '#2e003e',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
}); 