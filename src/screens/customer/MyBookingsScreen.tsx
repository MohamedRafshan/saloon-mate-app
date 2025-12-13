import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../../theme";

export const BookingScreen = ({ route, navigation }: any) => {
  const { salonId, serviceIds } = route.params;
  const [selectedDate, setSelectedDate] = useState("2024-12-25");
  const [selectedTime, setSelectedTime] = useState("14:00");

  const handleConfirmBooking = () => {
    Alert.alert(
      "Booking Confirmed",
      "Your appointment has been booked successfully!",
      [{ text: "OK", onPress: () => navigation.navigate("CustomerTabs") }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Select Date & Time</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Date</Text>
        <Text style={styles.value}>{selectedDate}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Time</Text>
        <Text style={styles.value}>{selectedTime}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleConfirmBooking}>
        <Text style={styles.buttonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export function MyBookingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>
      <ScrollView style={styles.content}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyText}>No bookings yet</Text>
          <Text style={styles.emptySubtext}>
            Your upcoming appointments will appear here
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  value: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundDark,
    borderRadius: theme.borderRadius.md,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
    marginTop: theme.spacing.lg,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.md,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
  },
});
