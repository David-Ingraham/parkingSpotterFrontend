import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import cameraLocations from '../data/camera_locations.json';
import { CameraLocations } from '../types/camera';

const typedCameraLocations = cameraLocations as CameraLocations;

interface AddressAutocompleteProps {
  onSelectAddress: (address: string) => void;
}

export function AddressAutocomplete({ onSelectAddress }: AddressAutocompleteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Convert underscore format to display format
  const formatAddress = (address: string) => {
    return address.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
  };

  // Search through available addresses
  const updateSuggestions = useCallback((query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const matches = Object.keys(typedCameraLocations)
      .filter(address => 
        formatAddress(address).toLowerCase().includes(searchTerm)
      );

    setSuggestions(matches);
  }, []);

  // Handle selection of an address
  const handleSelectAddress = (address: string) => {
    setSearchQuery(formatAddress(address));
    setSuggestions([]);
    onSelectAddress(address); // Pass back the underscore_formatted address
  };

  const renderSuggestion: ListRenderItem<string> = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelectAddress(item)}
    >
      <Text style={styles.suggestionText}>{formatAddress(item)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          updateSuggestions(text);
        }}
        placeholder="Search for an address..."
        placeholderTextColor="#666"
      />
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          renderItem={renderSuggestion}
          keyExtractor={(item) => item}
          style={styles.suggestionsList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 1,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    color: '#000',
  },
  suggestionsList: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 2,
    maxHeight: 400,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 16,
    color: '#000',
  },
}); 