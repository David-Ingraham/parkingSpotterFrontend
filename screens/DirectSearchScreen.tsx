import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AddressAutocomplete } from '../components/AddressAutocomplete';
import { CameraImage } from '../components/CameraImage';
import { BACKEND_URL } from '@env';

export function DirectSearchScreen() {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddressSelect = async (address: string) => {
    setSelectedAddress(address);
    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const response = await fetch(`${BACKEND_URL}/search_cameras`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          addresses: [address]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch camera image');
      }

      const data = await response.json();
      
      if (data.images && data.images.length > 0) {
        setImageUrl(data.images[0].url);
      } else {
        setError('No image available for this camera');
      }
    } catch (err) {
      setError('Failed to load camera image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.searchContainer}>
        <Text style={styles.title}>Search by Address</Text>
        <AddressAutocomplete onSelectAddress={handleAddressSelect} />
      </View>
      {selectedAddress && (
        <View style={styles.resultContainer}>
          <Text style={styles.selectedText}>
            Selected: {selectedAddress.replace(/_/g, ' ')}
          </Text>
          <CameraImage
            imageUrl={imageUrl}
            isLoading={isLoading}
            error={error}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#2e003e',
  },
  searchContainer: {
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  resultContainer: {
    padding: 20,
    alignItems: 'center',
  },
  selectedText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
}); 