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
              onError={(e) => {
                console.log("[ERROR] Failed to load image:", item.uri);
                console.log("error deets:" , e.nativeEvent);
              }}
              onLoad={()=>{
                console.log("[SUCCESS] Loaded image:", item.uri);
              }}
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
}); 