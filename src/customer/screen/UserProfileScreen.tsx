import { Ionicons } from "@expo/vector-icons";
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
import { extendedTheme as theme } from "../../theme";

export const UserProfileScreen = ({ navigation }: any) => {
  // Mock user state (replace with real auth later)
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    // Mock login - replace with real API call
    setUser({
      name: "Guest User",
      email: email,
      phone: "+1 234 567 8900",
      avatar: null,
    });
  };

  const logout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => setUser(null) },
    ]);
  };

  const menuItems = [
    { id: "1", title: "Edit Profile", icon: "👤", screen: "EditProfile" },
    { id: "2", title: "My Favorites", icon: "❤️", screen: "Favorites" },
    { id: "3", title: "Payment Methods", icon: "💳", screen: "PaymentMethods" },
    { id: "4", title: "Notifications", icon: "🔔", screen: "Notifications" },
    { id: "5", title: "Help & Support", icon: "❓", screen: "Support" },
    { id: "6", title: "Settings", icon: "⚙️", screen: "Settings" },
  ];

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert("Error", "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // Show login screen if user is not authenticated
  if (!user) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled={Platform.OS === "ios"}
      >
        <ScrollView
          style={styles.loginContainer}
          contentContainerStyle={styles.loginContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Ionicons name="close" size={28} color="#000000" />
          </TouchableOpacity>

          <View style={styles.loginForm}>
            <Text style={styles.welcomeTitle}>Welcome back</Text>
            <Text style={styles.welcomeSubtitle}>
              Create an account or log in to book and{"\n"}manage your
              appointments
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
                  navigation.navigate("Auth", {
                    screen: "Register",
                    params: { accountType: "customer" },
                  })
                }
              >
                <Text style={styles.linkText}>Register</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.linkContainer}>
              <Text style={styles.linkQuestion}>Have a business account?</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Auth", {
                    screen: "Register",
                    params: { accountType: "business" },
                  })
                }
              >
                <Text style={styles.linkText}>
                  Click here to create business account
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomLinks}>
              <TouchableOpacity style={styles.bottomLink}>
                <Ionicons name="globe-outline" size={20} color="#6B46FF" />
                <Text style={styles.bottomLinkText}>English</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bottomLink}>
                <Ionicons
                  name="help-circle-outline"
                  size={20}
                  color="#6B46FF"
                />
                <Text style={styles.bottomLinkText}>Support</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // Show profile screen if user is authenticated
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || "👤"}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.phone}>{user?.phone}</Text>
      </View>

      <View style={styles.menu}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => {
              // Navigation to specific screens will be implemented
              console.log("Navigate to:", item.screen);
            }}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuTitle}>{item.title}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundDark,
  },
  // Login Screen Styles
  loginContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loginContent: {
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
  loginForm: {
    marginTop: 60,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#666666",
    lineHeight: 24,
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 24,
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
    color: "#6B46FF",
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
    color: "#6B46FF",
    fontWeight: "500",
  },
  // Profile Screen Styles (when logged in)
  header: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.xl,
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: theme.colors.white,
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
  logoutButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.text,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
  },
  logoutButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  name: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  email: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  phone: {
    ...theme.typography.bodySmall,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
  menu: {
    backgroundColor: theme.colors.white,
    marginBottom: theme.spacing.md,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  menuTitle: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
  },
  menuArrow: {
    fontSize: 24,
    color: theme.colors.textLight,
  },
  footer: {
    padding: theme.spacing.lg,
  },
  version: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
    textAlign: "center",
    marginTop: theme.spacing.md,
  },
});
