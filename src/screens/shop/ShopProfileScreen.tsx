import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { authService } from "../../services/authService";

export function ShopProfileScreen() {
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          await authService.clearAuth();
          // App will automatically redirect to login after clearing auth
        },
      },
    ]);
  };

  const handleMenuPress = (screen: string) => {
    navigation.navigate(screen);
  };

  const menuSections = [
    {
      title: "Business Settings",
      items: [
        { icon: "🏢", label: "Business Info", screen: "BusinessInfo" },
        { icon: "⏰", label: "Opening Hours", screen: "BusinessHours" },
        { icon: "📍", label: "Location", screen: "Location" },
        { icon: "👥", label: "Manage Staff", screen: "StaffManagement" },
      ],
    },
    {
      title: "Content",
      items: [
        { icon: "📸", label: "Gallery", screen: "Gallery" },
        { icon: "⭐", label: "Reviews", screen: "Reviews" },
      ],
    },
    {
      title: "Finance",
      items: [
        { icon: "💰", label: "Earnings", screen: "Earnings" },
        { icon: "💳", label: "Payment Settings", screen: "PaymentSettings" },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: "❓", label: "Help Center", screen: "Help" },
        { icon: "📞", label: "Contact Support", screen: "ContactSupport" },
        { icon: "⚙️", label: "Settings", screen: "Settings" },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.businessAvatar}>
          <Text style={styles.businessAvatarText}>🏢</Text>
        </View>
        <Text style={styles.businessName}>Luxe Salon & Spa</Text>
        <Text style={styles.businessEmail}>business@luxesalon.com</Text>
        <Text style={styles.businessPhone}>+1 234 567 8900</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>250</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>1.2k</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>
        </View>
      </View>

      {menuSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.menu}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.menuItem}
                onPress={() => handleMenuPress(item.screen)}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: "center",
    marginBottom: 16,
  },
  businessAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#6C5CE7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  businessAvatarText: {
    fontSize: 40,
  },
  businessName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  businessEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  businessPhone: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 32,
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
    textTransform: "uppercase",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  menu: {
    backgroundColor: "#fff",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  menuArrow: {
    fontSize: 24,
    color: "#999",
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  logoutButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FF6B6B",
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 16,
  },
  logoutButtonText: {
    color: "#FF6B6B",
    fontSize: 16,
    fontWeight: "600",
  },
  version: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
});
