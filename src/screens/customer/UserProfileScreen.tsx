import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { authService } from "../../services/authService";
import { extendedTheme as theme } from "../../theme";

export const UserProfileScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const userData = await authService.getUser();
      setUser(userData);
    } catch (error) {
      console.error("Error checking auth:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    // Subscribe to auth state changes
    const unsubscribe = authService.subscribe(() => {
      checkAuth();
    });

    return () => {
      unsubscribe();
    };
  }, [checkAuth]);

  const logout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          await authService.clearAuth();
          setUser(null);
        },
      },
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

  // Show login/register options if user is not authenticated
  if (!user) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.guestContainer}>
          <View style={styles.guestHeader}>
            <Text style={styles.guestIcon}>👤</Text>
            <Text style={styles.guestTitle}>Welcome to Salon App</Text>
            <Text style={styles.guestSubtitle}>
              Sign in to book appointments, save favorites, and manage your
              profile
            </Text>
          </View>

          <View style={styles.authButtons}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() =>
                navigation.navigate("AuthStack", { screen: "Login" })
              }
            >
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() =>
                navigation.navigate("AuthStack", {
                  screen: "Register",
                  params: { accountType: "customer" },
                })
              }
            >
              <Text style={styles.registerButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.guestMenu}>
            <Text style={styles.guestMenuTitle}>Browse as Guest</Text>
            {menuItems
              .filter((item) =>
                ["Help & Support", "Settings"].includes(item.title)
              )
              .map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.guestMenuItem}
                  onPress={() => console.log("Navigate to:", item.screen)}
                >
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>
      </ScrollView>
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
  // Guest Screen Styles
  guestContainer: {
    flex: 1,
    paddingTop: 60,
  },
  guestHeader: {
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 40,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  guestIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  guestTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
    textAlign: "center",
  },
  guestSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  authButtons: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  loginButton: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 12,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  registerButton: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000",
  },
  registerButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  guestMenu: {
    backgroundColor: "#fff",
    paddingTop: 16,
  },
  guestMenuTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  guestMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
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
    backgroundColor: theme.colors.white,
  },
  logoutButton: {
    backgroundColor: "#ff3b30",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 16,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  version: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
    textAlign: "center",
  },
});
