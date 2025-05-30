// App.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const SERVER_URL = 'http://10.0.2.2:8000/photo';
const TEST_IMAGE = 'http://10.0.2.2:8000/static/imgs/1748630951_10_Ave_W_34_St.jpg'

// Shape of each item we're rendering
type PhotoItem = {
  address: string;
  uri: string;
};

/**
 * Ask for Android location permission at runtime.
 */
async function askLocationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );

  return status === PermissionsAndroid.RESULTS.GRANTED;
}

/**
 * Get the device's current position with high accuracy.
 */
function getCurrentPosition(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
}

/**
 * POST lat/lng to the backend, parse JSON response,
 * and return an array of PhotoItem with data URI.
 */
async function fetchPhotos(
  lat: number,
  lng: number
): Promise<PhotoItem[]> {
  console.log("attempting post")

  

  try {  const response = await fetch(SERVER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat, lng }),
  });

  console.log(response)


  const { images } = await response.json();



  // Convert each base64 string to a data URI
  return images.map((img: any) => ({
    address: img.address,
    uri: img.url,
  }));} catch (err: any) {
    console.log("fetch error:", err.message);
  }
  return []
}

/**
 * Custom hook to manage loading location + photos.
 */
function useNearbyPhotos() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadPhotos() {
    setError(null);
    setLoading(true);
    setPhotos([]);

    try {
      const permission = await askLocationPermission();
      if (!permission) {
        throw new Error('Location permission denied');
      }

      const { lat, lng } = await getCurrentPosition();
      setCoords({ lat, lng });
      console.log("setCoords passes")

      const fetched = await fetchPhotos(lat, lng);
    
      setPhotos(fetched);
    } catch (err: any) {
      setError(err.message);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  }

  return { coords, photos, loading, error, loadPhotos };
}

/**
 * Main app component.
 */
export default function App() {

  const { coords, photos, loading, error, loadPhotos } = useNearbyPhotos();

  return (
    <View style={styles.container}>
      <Button
        title="Get Nearby Photos"
        onPress={loadPhotos}
        disabled={loading}
      />
      //<Text style={{marginTop: 16}}>Manual Test:</Text>
      //<Image source={{uri: TEST_IMAGE}} style={styles.photo} />

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
            <Text style={styles.photoLabel}>{item.address}</Text>
            <Image 
              source={{ uri: item.uri }} 
              style={styles.photo} 
              onError={(e) => {
                console.log("❌ Failed to load imaged:", item.uri);
                console.log("error deets:" , e.nativeEvent);
              }}
              onLoad={()=>{
                console.log("✅ Loaded image:", item.uri);
              }}
            
            />
          </View>
        )}
      />
    </View>
  );
}

/**
 * Stylesheet for layout and styling.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  coords: {
    marginTop: 12,
    fontSize: 16,
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    marginTop: 12,
    color: 'red',
  },
  list: {
    paddingVertical: 16,
  },
  photoCard: {
    marginBottom: 24,
    alignItems: 'center',
  },
  photoLabel: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  photo: {
    width: 320,
    height: 200,
    borderRadius: 8,
  },
});