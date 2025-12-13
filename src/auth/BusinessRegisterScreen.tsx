import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthStackParamList } from "../navigation/AuthStack";

type BusinessRegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "BusinessRegister"
>;

export const BusinessRegisterScreen = () => {
  const navigation = useNavigation<BusinessRegisterScreenNavigationProp>();

  const canGoBack = useNavigationState((state) => state.index > 0);

  const handleBack = () => {
    if (canGoBack) {
      navigation.goBack();
    } else {
      // Navigate to customer home when no screen to go back to
      (navigation as any).navigate("CustomerTabNavigator", {
        screen: "HomeTab",
      });
    }
  };

  // Business Information
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Location
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // Owner Information
  const [ownerName, setOwnerName] = useState("");

  // Security
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Amenities (checkboxes)
  const [hasWiFi, setHasWiFi] = useState(false);
  const [hasParking, setHasParking] = useState(false);
  const [hasCoffeeBar, setHasCoffeeBar] = useState(false);
  const [hasMusic, setHasMusic] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validate required fields
    if (
      !businessName ||
      !description ||
      !category ||
      !ownerName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    // Validate location if provided
    if (latitude && isNaN(parseFloat(latitude))) {
      Alert.alert("Error", "Please enter a valid latitude");
      return;
    }
    if (longitude && isNaN(parseFloat(longitude))) {
      Alert.alert("Error", "Please enter a valid longitude");
      return;
    }

    setLoading(true);
    try {
      const { authService } = await import("../services/authService");

      // Prepare amenities array
      const amenities = [];
      if (hasWiFi) amenities.push("WiFi");
      if (hasParking) amenities.push("Parking");
      if (hasCoffeeBar) amenities.push("Coffee Bar");
      if (hasMusic) amenities.push("Music");

      await authService.register(
        {
          name: ownerName,
          email: email,
          phone: phone,
          role: "business",
          businessName: businessName,
          description: description,
          category: category,
          address: address,
          city: city,
          latitude: latitude ? parseFloat(latitude) : undefined,
          longitude: longitude ? parseFloat(longitude) : undefined,
          amenities: amenities,
        },
        password
      );

      Alert.alert(
        "Success",
        "Business account created successfully! You can now access your dashboard."
      );
    } catch {
      Alert.alert("Error", "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      enabled={Platform.OS === "ios"}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={28} color="#000000" />
        </TouchableOpacity>

        <View style={styles.form}>
          <View style={styles.header}>
            <Text style={styles.badge}>🏢</Text>
            <Text style={styles.title}>Register Your Business</Text>
          </View>

          <Text style={styles.subtitle}>
            Join our platform to connect with customers and grow your business
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.sectionTitle}>Business Information</Text>

            <TextInput
              style={styles.input}
              placeholder="Business Name *"
              value={businessName}
              onChangeText={setBusinessName}
              autoCapitalize="words"
              placeholderTextColor="#999"
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Business Description *"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Category (e.g., Hair Salon, Barber, Beauty Salon) *"
              value={category}
              onChangeText={setCategory}
              autoCapitalize="words"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Business Address *"
              value={address}
              onChangeText={setAddress}
              autoCapitalize="words"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="City *"
              value={city}
              onChangeText={setCity}
              autoCapitalize="words"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Business Phone *"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Business Email *"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />

            <Text style={styles.sectionTitle}>Location (Optional)</Text>
            <Text style={styles.helperText}>
              Provide coordinates to help customers find your business
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Latitude (e.g., 6.9271)"
              value={latitude}
              onChangeText={setLatitude}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Longitude (e.g., 79.8612)"
              value={longitude}
              onChangeText={setLongitude}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />

            <Text style={styles.sectionTitle}>Amenities</Text>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setHasWiFi(!hasWiFi)}
              >
                <Ionicons
                  name={hasWiFi ? "checkbox" : "square-outline"}
                  size={24}
                  color={hasWiFi ? "#6C5CE7" : "#999"}
                />
                <Text style={styles.checkboxLabel}>WiFi</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setHasParking(!hasParking)}
              >
                <Ionicons
                  name={hasParking ? "checkbox" : "square-outline"}
                  size={24}
                  color={hasParking ? "#6C5CE7" : "#999"}
                />
                <Text style={styles.checkboxLabel}>Parking</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setHasCoffeeBar(!hasCoffeeBar)}
              >
                <Ionicons
                  name={hasCoffeeBar ? "checkbox" : "square-outline"}
                  size={24}
                  color={hasCoffeeBar ? "#6C5CE7" : "#999"}
                />
                <Text style={styles.checkboxLabel}>Coffee Bar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setHasMusic(!hasMusic)}
              >
                <Ionicons
                  name={hasMusic ? "checkbox" : "square-outline"}
                  size={24}
                  color={hasMusic ? "#6C5CE7" : "#999"}
                />
                <Text style={styles.checkboxLabel}>Music</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Owner Information</Text>

            <TextInput
              style={styles.input}
              placeholder="Owner Name *"
              value={ownerName}
              onChangeText={setOwnerName}
              autoCapitalize="words"
              placeholderTextColor="#999"
            />

            <Text style={styles.sectionTitle}>Security</Text>

            <TextInput
              style={styles.input}
              placeholder="Password *"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm Password *"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? "Creating Account..." : "Create Business Account"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.linkContainer}>
            <Text style={styles.linkQuestion}>
              Already have a business account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.linkText}>Log in as business</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.termsText}>
            By creating a business account, you agree to our Business Terms of
            Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 24,
    zIndex: 10,
  },
  form: {
    marginTop: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  badge: {
    fontSize: 32,
    marginRight: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000000",
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    lineHeight: 24,
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginTop: 16,
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  helperText: {
    fontSize: 13,
    color: "#999",
    marginBottom: 12,
    marginTop: -8,
  },
  checkboxContainer: {
    marginBottom: 8,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#000",
    marginLeft: 8,
  },
  registerButton: {
    backgroundColor: "#6C5CE7",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 24,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  linkContainer: {
    marginBottom: 16,
    marginTop: 16,
  },
  linkQuestion: {
    fontSize: 15,
    color: "#000000",
    marginBottom: 4,
  },
  linkText: {
    fontSize: 15,
    color: "#6C5CE7",
    fontWeight: "500",
  },
  termsText: {
    fontSize: 13,
    color: "#999999",
    lineHeight: 20,
    textAlign: "center",
    marginTop: 24,
  },
});
