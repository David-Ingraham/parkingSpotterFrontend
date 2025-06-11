import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  DirectSearch: undefined;
  NearestParking: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  
  return (
    <View style={styles.homeContainer}>
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('DirectSearch')}
      >
        <Text style={styles.emoji}>🔍</Text>
        <Text style={styles.cardText}>Search Cameras</Text>
        <Text style={styles.cardDescription}>
          Search specific parking camera locations
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.card, styles.cardSecondary]}
        onPress={() => navigation.navigate('NearestParking')}
      >
        <Text style={styles.emoji}>📍</Text>
        <Text style={styles.cardText}>Find Nearest Parking</Text>
        <Text style={styles.cardDescription}>
          Locate available parking near you
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#2e003e',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#3f0058',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardSecondary: {
    backgroundColor: '#4a006a',
  },
  emoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  cardText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  cardDescription: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.9,
  },
}); 