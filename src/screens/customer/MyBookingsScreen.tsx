import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { bookingService } from "../../api/bookingService";
import { mockAPI } from "../../api/mock";
import { authService, AuthUser } from "../../services/authService";
import { theme } from "../../theme";
import { Booking } from "../../types/Booking";
import { Salon } from "../../types/Salon";
import { Service } from "../../types/Service";

export function MyBookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [salons, setSalons] = useState<{ [key: string]: Salon }>({});
  const [services, setServices] = useState<{ [key: string]: Service }>({});
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthAndLoadBookings();
  }, []);

  useEffect(() => {
    // Subscribe to auth changes
    const unsubscribe = authService.subscribe(() => {
      checkAuthAndLoadBookings();
    });

    return unsubscribe;
  }, []);

  // Refresh bookings when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (isAuthenticated && currentUser) {
        loadBookings(currentUser.id);
      }
    }, [isAuthenticated, currentUser])
  );

  const checkAuthAndLoadBookings = async () => {
    try {
      const authenticated = await authService.isAuthenticated();
      const user = await authService.getUser();

      if (!authenticated || !user) {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      setIsAuthenticated(true);
      setCurrentUser(user);
      await loadBookings(user.id);
    } catch (error) {
      console.error("Failed to check authentication:", error);
      setIsAuthenticated(false);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadBookings = async (userId: string) => {
    try {
      const bookingsData = await bookingService.getCustomerBookings(userId);
      setBookings(bookingsData);

      // Load salon and service details for each booking
      const salonMap: { [key: string]: Salon } = {};
      const serviceMap: { [key: string]: Service } = {};

      for (const booking of bookingsData) {
        if (!salonMap[booking.salonId]) {
          const salon = await mockAPI.getSalonById(booking.salonId);
          salonMap[booking.salonId] = salon;
        }

        for (const serviceId of booking.serviceIds) {
          if (!serviceMap[serviceId]) {
            const service = await mockAPI.getServiceById(serviceId);
            serviceMap[serviceId] = service;
          }
        }
      }

      setSalons(salonMap);
      setServices(serviceMap);
    } catch (err) {
      console.error("Failed to load bookings:", err);
      Alert.alert("Error", "Failed to load bookings");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    checkAuthAndLoadBookings();
  };

  const handleCancelBooking = (bookingId: string) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              await bookingService.cancelBooking(bookingId);
              Alert.alert("Success", "Booking cancelled successfully");
              if (currentUser) {
                loadBookings(currentUser.id);
              }
            } catch (error) {
              Alert.alert("Error", "Failed to cancel booking");
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "confirmed":
        return theme.colors.primary;
      case "pending":
        return "#FFA500";
      case "completed":
        return "#4CAF50";
      case "cancelled":
        return "#F44336";
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusText = (status: Booking["status"]) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated || !currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>My Bookings</Text>
        <View style={styles.centered}>
          <Text style={styles.authIcon}>🔒</Text>
          <Text style={styles.authTitle}>Login Required</Text>
          <Text style={styles.authText}>
            Please log in to view your bookings
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {bookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>No bookings yet</Text>
            <Text style={styles.emptySubtext}>
              Your upcoming appointments will appear here
            </Text>
          </View>
        ) : (
          bookings.map((booking) => {
            const salon = salons[booking.salonId];
            const bookingServices = booking.serviceIds.map(
              (id) => services[id]
            );

            return (
              <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingHeader}>
                  <View style={styles.bookingHeaderLeft}>
                    <Text style={styles.salonName}>
                      {salon?.name || "Loading..."}
                    </Text>
                    <Text style={styles.bookingDate}>
                      📅 {formatDate(booking.date)}
                    </Text>
                    <Text style={styles.bookingTime}>🕐 {booking.time}</Text>
                    {salon?.address && (
                      <Text style={styles.bookingLocation}>
                        📍 {salon.address}
                      </Text>
                    )}
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(booking.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {getStatusText(booking.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.bookingDivider} />

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Booking ID:</Text>
                  <Text style={styles.detailValue}>{booking.id}</Text>
                </View>

                <View style={styles.servicesSection}>
                  <Text style={styles.servicesLabel}>Services Booked:</Text>
                  {bookingServices.map((service) => (
                    <View key={service?.id} style={styles.serviceItem}>
                      <Text style={styles.serviceName}>
                        • {service?.name || "Loading..."}
                      </Text>
                      <Text style={styles.servicePrice}>
                        ${service?.price || 0}
                      </Text>
                    </View>
                  ))}
                  {bookingServices.length > 0 && (
                    <Text style={styles.serviceDuration}>
                      Duration:{" "}
                      {bookingServices.reduce((total, s) => {
                        const duration = s?.duration || "0 min";
                        const minutes = parseInt(duration);
                        return total + (isNaN(minutes) ? 0 : minutes);
                      }, 0)}{" "}
                      minutes
                    </Text>
                  )}
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Payment Status:</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      {
                        color:
                          booking.paymentStatus === "paid"
                            ? "#4CAF50"
                            : "#FFA500",
                      },
                    ]}
                  >
                    {booking.paymentStatus.toUpperCase()}
                  </Text>
                </View>

                {booking.notes && (
                  <View style={styles.notesSection}>
                    <Text style={styles.notesLabel}>Notes:</Text>
                    <Text style={styles.notesText}>{booking.notes}</Text>
                  </View>
                )}

                <View style={styles.bookingFooter}>
                  <Text style={styles.totalPrice}>
                    Total: ${booking.totalPrice}
                  </Text>
                  {booking.status === "pending" && (
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => handleCancelBooking(booking.id)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.white,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
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
  bookingCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.backgroundDark,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  bookingHeaderLeft: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  salonName: {
    ...theme.typography.h4,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  bookingDate: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  bookingTime: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  bookingLocation: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  statusText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.sm,
    fontWeight: "600",
  },
  bookingDivider: {
    height: 1,
    backgroundColor: theme.colors.backgroundDark,
    marginBottom: theme.spacing.md,
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
    paddingLeft: theme.spacing.sm,
  },
  serviceName: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  servicePrice: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "600",
  },
  serviceDuration: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    paddingLeft: theme.spacing.sm,
    fontStyle: "italic",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  detailLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  detailValue: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "600",
  },
  servicesSection: {
    marginBottom: theme.spacing.md,
  },
  servicesLabel: {
    ...theme.typography.body,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  notesSection: {
    backgroundColor: theme.colors.backgroundDark,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  notesLabel: {
    ...theme.typography.body,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  notesText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  bookingFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.sm,
  },
  totalPrice: {
    ...theme.typography.h4,
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  cancelButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: "#F44336",
  },
  cancelButtonText: {
    color: "#F44336",
    fontSize: theme.fontSize.sm,
    fontWeight: "600",
  },
  authIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  authTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  authText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: theme.spacing.lg,
  },
});
