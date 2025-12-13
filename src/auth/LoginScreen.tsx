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

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"
>;

export const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      // Mock login - replace with real API call
      setTimeout(() => {
        Alert.alert("Success", "Login successful!");
        setLoading(false);
      }, 1000);
    } catch (error) {
      Alert.alert("Error", "Invalid email or password");
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
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={28} color="#000000" />
        </TouchableOpacity>

        <View style={styles.form}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Log in to book and manage your appointments
          </Text>

          <View style={styles.inputContainer}>
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
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.continueButtonText}>
                {loading ? "Loading..." : "Continue"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.linkContainer}>
            <Text style={styles.linkQuestion}>Dont have an account?</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Register", { accountType: "customer" })
              }
            >
              <Text style={styles.linkText}>Register</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.linkContainer}>
            <Text style={styles.linkQuestion}>Have a business?</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Register", { accountType: "business" })
              }
            >
              <Text style={styles.linkText}>Create business account</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomLinks}>
            <TouchableOpacity style={styles.bottomLink}>
              <Ionicons name="globe-outline" size={20} color="#6C5CE7" />
              <Text style={styles.bottomLinkText}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomLink}>
              <Ionicons name="help-circle-outline" size={20} color="#6C5CE7" />
              <Text style={styles.bottomLinkText}>Support</Text>
            </TouchableOpacity>
          </View>
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
  closeButton: {
    position: "absolute",
    top: 60,
    right: 24,
    zIndex: 10,
  },
  form: {
    marginTop: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    lineHeight: 24,
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 24,
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
  continueButton: {
    backgroundColor: "#000000",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 16,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  linkContainer: {
    marginBottom: 16,
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
  bottomLinks: {
    flexDirection: "row",
    marginTop: 40,
    gap: 32,
  },
  bottomLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bottomLinkText: {
    fontSize: 15,
    color: "#6C5CE7",
    fontWeight: "500",
  },
});
