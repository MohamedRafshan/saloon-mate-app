import { Ionicons } from "@expo/vector-icons";
import {
  RouteProp,
  useNavigation,
  useNavigationState,
  useRoute,
} from "@react-navigation/native";
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

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Register"
>;
type RegisterScreenRouteProp = RouteProp<AuthStackParamList, "Register">;

export const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const route = useRoute<RegisterScreenRouteProp>();
  const accountType = route.params?.accountType || "customer";

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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
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
      const { authService } = await import("../services/authService");
      await authService.register(
        {
          name: name,
          email: email,
          phone: phone,
          role: accountType,
        },
        password
      );

      Alert.alert(
        "Success",
        `${
          accountType === "business" ? "Business" : "Customer"
        } account created successfully!`
      );
    } catch (error) {
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            {accountType === "business"
              ? "Register your business to start accepting bookings"
              : "Sign up to book appointments and manage your visits"}
          </Text>

          {accountType === "business" && (
            <View style={styles.accountTypeBadge}>
              <Text style={styles.accountTypeText}>🏢 Business Account</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={
                accountType === "business" ? "Business Name" : "Full Name"
              }
              value={name}
              onChangeText={setName}
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
                {loading ? "Creating Account..." : "Create Account"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.linkContainer}>
            <Text style={styles.linkQuestion}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.linkText}>Log in</Text>
            </TouchableOpacity>
          </View>

          {accountType === "customer" && (
            <View style={styles.linkContainer}>
              <Text style={styles.linkQuestion}>
                Want to register a business?
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Register", { accountType: "business" })
                }
              >
                <Text style={styles.linkText}>Create business account</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.termsText}>
            By creating an account, you agree to our Terms of Service and
            Privacy Policy
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
    marginBottom: 20,
  },
  accountTypeBadge: {
    backgroundColor: "#F0EDFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  accountTypeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6C5CE7",
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
  registerButton: {
    backgroundColor: "#6C5CE7",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 16,
  },
  registerButtonText: {
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
  termsText: {
    fontSize: 13,
    color: "#999999",
    lineHeight: 20,
    textAlign: "center",
    marginTop: 24,
  },
});
