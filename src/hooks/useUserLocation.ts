import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useEffect, useState } from "react";

export interface UserLocation {
  latitude: number;
  longitude: number;
}

interface UseUserLocationReturn {
  location: UserLocation | null;
  loading: boolean;
  error: string | null;
  requestPermission: () => Promise<boolean>;
}

const LOCATION_STORAGE_KEY = "user_location";

export const useUserLocation = (): UseUserLocationReturn => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const saveLocationToStorage = async (loc: UserLocation) => {
    try {
      await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(loc));
    } catch (err) {
      console.error("Failed to save location to storage", err);
    }
  };

  const loadSavedLocation = async (): Promise<UserLocation | null> => {
    try {
      const savedLocation = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
      return savedLocation ? JSON.parse(savedLocation) : null;
    } catch (err) {
      console.error("Failed to load saved location", err);
      return null;
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied");
        return false;
      }
      await getCurrentLocation();
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to request location permission";
      setError(errorMessage);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const newLocation = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      };
      setLocation(newLocation);
      await saveLocationToStorage(newLocation);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get location";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeLocation = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        
        if (status === "granted") {
          // Permission already granted, get fresh location
          await getCurrentLocation();
        } else {
          // Load saved location and prompt for permission
          const savedLocation = await loadSavedLocation();
          if (savedLocation) {
            setLocation(savedLocation);
          }
          setLoading(false);
          // Prompt for permission
          await requestPermission();
        }
      } catch (err) {
        console.error("Failed to initialize location", err);
        setLoading(false);
      }
    };

    initializeLocation();
  }, []);

  return { location, loading, error, requestPermission };
};
