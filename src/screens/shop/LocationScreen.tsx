import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { salonService } from "../../api/salonService";
import { authService } from "../../services/authService";
import { getCurrentCoordinates } from "../../services/locationService";

export function LocationScreen() {
  const [salonId, setSalonId] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    (async () => {
      const user = await authService.getUser();
      if (user?.businessId) {
        setSalonId(user.businessId);
        try {
          const salon = await salonService.getSalonById(user.businessId);
          setLatitude(String(salon.location?.latitude ?? ""));
          setLongitude(String(salon.location?.longitude ?? ""));
          setAddress((salon as any).address || "");
        } catch {}
      }
    })();
  }, []);

  const handleUseMyLocation = async () => {
    const coords = await getCurrentCoordinates();
    if (!coords) {
      Alert.alert("Permission", "Allow location access to fetch coordinates.");
      return;
    }
    setLatitude(String(coords.latitude));
    setLongitude(String(coords.longitude));
  };

  const handleSave = async () => {
    if (!salonId) return;
    try {
      await salonService.updateSalon(salonId, {
        address,
        location: {
          latitude: Number(latitude),
          longitude: Number(longitude),
        },
      } as any);
      Alert.alert("Saved", "Location updated");
    } catch {
      Alert.alert("Error", "Failed to update location");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location</Text>
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <View style={{ height: 8 }} />
      <TextInput
        style={styles.input}
        placeholder="Latitude"
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="decimal-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Longitude"
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="decimal-pad"
      />
      <TouchableOpacity
        style={styles.buttonOutline}
        onPress={handleUseMyLocation}
      >
        <Text style={styles.buttonOutlineText}>Use My Current Location</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Location</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  button: {
    backgroundColor: "#6C5CE7",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  buttonOutline: {
    backgroundColor: "#F0EDFF",
    borderColor: "#6C5CE7",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonOutlineText: { color: "#6C5CE7", fontWeight: "600" },
});
