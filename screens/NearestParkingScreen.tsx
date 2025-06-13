import React from 'react';
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNearbyPhotos } from '../hooks/useNearbyPhotos';

export function NearestParkingScreen() {
  const { coords, photos, loading, error, loadPhotos } = useNearbyPhotos();

  // If it's the NYC boundary error, show a centered message with coordinates
  if (error?.includes(' This feature of parking spotter only works in NYC')) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Location Out of Range</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        {coords && (
          <Text style={styles.coordsError}>
            Current Location: Lat {coords.lat.toFixed(5)}, Lng {coords.lng.toFixed(5)}
          </Text>
        )}
        <Text style={styles.helpText}>
          Use ADB commands to set NYC coordinates:{'\n'}
          adb shell settings put secure location mode 1{'\n'}
          adb emu geo fix -73.9857 40.7484
        </Text>
        <Button
          title="Try Again"
          onPress={loadPhotos}
          disabled={loading}
        />
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <Button
        title="Get Nearby Photos"
        onPress={loadPhotos}
        disabled={loading}
      />
      
      {coords && (
        <Text style={styles.coords}>
          Lat {coords.lat.toFixed(5)}, Lng {coords.lng.toFixed(5)}
        </Text>
      )}

      {loading && <ActivityIndicator style={styles.loader} size="large" />}

      {/* Show other types of errors in the normal way */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={photos}
        keyExtractor={(item) => item.address}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.photoCard}>
            <Text style={styles.photoLabel}>{item.address.replace(/_/g, " ")}</Text>
            <Image 
              source={{ uri: item.uri }} 
              style={styles.photo} 
            />
          </View>
        )}
      />
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2e003e',
    padding: 20,
  },
  errorTitle: {
    color: '#ff4444',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorMessage: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  coords: {
    marginTop: 12,
    fontSize: 16,
    color: '#fff',
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    marginTop: 20,
  },
  list: {
    padding: 16,
  },
  photoCard: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#3f0058',
    borderRadius: 8,
  },
  photoLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  photo: {
    width: 320,
    height: 240,
    borderRadius: 8,
  },
  coordsError: {
    color: '#ffaa00',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  helpText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'monospace',
  },
}); 