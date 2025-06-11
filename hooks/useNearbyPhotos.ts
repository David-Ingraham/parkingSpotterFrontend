import { useState } from 'react';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { BACKEND_URL } from '@env';

const SERVER_URL = `${BACKEND_URL}/fiveNearest`;

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

  try {
    const response = await fetch(SERVER_URL, {
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
    }));
  } catch (err: any) {
    console.log("fetch error:", err.message);
  }
  return []
}

/**
 * Custom hook to manage loading location + photos.
 */
export function useNearbyPhotos() {
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