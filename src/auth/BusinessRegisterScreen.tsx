import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
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

  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !businessName ||
      !ownerName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Error", "Please fill in all fields");
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

    setLoading(true);
    try {
      // Mock registration - replace with real API call
      setTimeout(() => {
        Alert.alert(
          "Success",
          "Business account created successfully! We will review your application.",
          [{ text: "OK", onPress: () => navigation.navigate("Login") }]
        );
        setLoading(false);
      }, 1000);
    } catch (error) {
      Alert.alert("Error", "Registration failed. Please try again.");
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
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
              placeholder="Business Name"
              value={businessName}
              onChangeText={setBusinessName}
              autoCapitalize="words"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Business Address"
              value={address}
              onChangeText={setAddress}
              autoCapitalize="words"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="City"
              value={city}
              onChangeText={setCity}
              autoCapitalize="words"
              placeholderTextColor="#999"
            />

            <Text style={styles.sectionTitle}>Owner Information</Text>

            <TextInput
              style={styles.input}
              placeholder="Owner Name"
              value={ownerName}
              onChangeText={setOwnerName}
              autoCapitalize="words"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />

            <Text style={styles.sectionTitle}>Security</Text>

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
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
            <Text style={styles.linkQuestion}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.linkText}>Log in</Text>
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
