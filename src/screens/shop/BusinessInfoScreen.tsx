import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { salonService } from "../../api/salonService";
import { authService } from "../../services/authService";
import { Salon } from "../../types/Salon";

export function BusinessInfoScreen() {
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    (async () => {
      const user = await authService.getUser();
      const salonId = user?.businessId;
      if (!salonId) {
        setLoading(false);
        return;
      }
      try {
        const s = await salonService.getSalonById(salonId);
        setSalon(s);
        setName(s.name);
        setDescription(s.description || "");
        setPhone((s as any).phone || "");
        setEmail((s as any).email || "");
        setAddress((s as any).address || "");
      } catch (e) {
        Alert.alert("Error", "Failed to load business info");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    if (!salon) return;
    try {
      const updated = await salonService.updateSalon(salon.id, {
        name,
        description,
        phone,
        email,
        address,
      } as any);
      setSalon(updated);
      Alert.alert("Saved", "Business info updated");
    } catch (e) {
      Alert.alert("Error", "Failed to save business info");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!salon) {
    return (
      <View style={styles.container}>
        <Text>No business found for this account.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.form} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.header}>Business Info</Text>
      <TextInput
        style={styles.input}
        placeholder="Business Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  form: { flex: 1, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  textArea: { minHeight: 100, textAlignVertical: "top" },
  saveButton: {
    backgroundColor: "#6C5CE7",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: { color: "#fff", fontWeight: "600" },
});
