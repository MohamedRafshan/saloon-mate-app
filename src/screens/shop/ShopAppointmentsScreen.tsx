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
import { salonService } from "../../api/salonService";
import { authService, AuthUser } from "../../services/authService"; // If you want to check shop auth
import { serviceService } from "../../services/serviceService";
import { theme } from "../../theme";
import { Booking } from "../../types/Booking";
import { Salon } from "../../types/Salon";
import { Service } from "../../types/Service";

export function ShopAppointmentsScreen() {
  // Change filter type to include "all"
  const [filter, setFilter] = useState<"all" | "today" | "upcoming" | "past">(
    "all"
  );
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [salons, setSalons] = useState<{ [key: string]: Salon }>({});
  const [services, setServices] = useState<{ [key: string]: Service }>({});
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthAndLoadAppointments();
  }, []);

  useEffect(() => {
    // Subscribe to auth changes
    const unsubscribe = authService.subscribe(() => {
      checkAuthAndLoadAppointments();
    });
    return unsubscribe;
  }, []);

  const checkAuthAndLoadAppointments = async () => {
    setLoading(true);
    try {
      const authenticated = await authService.isAuthenticated();
      const user = await authService.getUser();

      if (
        !authenticated ||
        !user ||
        user.role !== "business" ||
        !user.businessId
      ) {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setAppointments([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      setIsAuthenticated(true);
      setCurrentUser(user);
      await loadAppointments(user.businessId);
    } catch (error) {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setAppointments([]);
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Accept shopId as parameter
  const loadAppointments = async (shopId?: string) => {
    setLoading(true);
    try {
      if (!shopId) {
        setAppointments([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }
      const data = await bookingService.getSalonBookings(shopId);
      setAppointments(data || []);

      // Load salon and service details for each booking
      const salonMap: { [key: string]: Salon } = {};
      const serviceMap: { [key: string]: Service } = {};
      for (const booking of data || []) {
        if (!salonMap[booking.salonId]) {
          try {
            const salon = await salonService.getSalonById(booking.salonId);
            salonMap[booking.salonId] = salon;
          } catch {
            // ignore
          }
        }
        if (booking.serviceIds && booking.serviceIds.length) {
          const servicesArr = await serviceService.getBySalonId(
            booking.salonId
          );
          servicesArr.forEach((svc) => {
            serviceMap[svc.id] = svc;
          });
        }
      }
      setSalons(salonMap);
      setServices(serviceMap);
    } catch {
      Alert.alert("Error", "Failed to load appointments");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (currentUser && currentUser.businessId) {
      loadAppointments(currentUser.businessId);
    } else {
      setRefreshing(false);
    }
  };

  // Filter logic
  const now = new Date();
  const filteredAppointments = appointments.filter((booking) => {
    const bookingDate = new Date(booking.date);
    if (filter === "all") {
      return true;
    }
    if (filter === "today") {
      return (
        bookingDate.getDate() === now.getDate() &&
        bookingDate.getMonth() === now.getMonth() &&
        bookingDate.getFullYear() === now.getFullYear()
      );
    } else if (filter === "upcoming") {
      return bookingDate > now;
    } else {
      return bookingDate < now;
    }
  });

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "confirmed":
        return theme.colors.primary || "#00C853";
      case "pending":
        return "#FFA726";
      case "completed":
        return "#666";
      case "cancelled":
        return "#F44336";
      default:
        return "#666";
    }
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
      <View style={styles.centered}>
        <Text style={{ fontSize: 18, color: "#666" }}>
          Please log in as a business to view appointments.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Appointments</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === "all" && styles.filterTabActive]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "all" && styles.filterTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "today" && styles.filterTabActive,
          ]}
          onPress={() => setFilter("today")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "today" && styles.filterTextActive,
            ]}
          >
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "upcoming" && styles.filterTabActive,
          ]}
          onPress={() => setFilter("upcoming")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "upcoming" && styles.filterTextActive,
            ]}
          >
            Upcome
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "past" && styles.filterTabActive,
          ]}
          onPress={() => setFilter("past")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "past" && styles.filterTextActive,
            ]}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredAppointments.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>No appointments</Text>
            <Text style={styles.emptySubtext}>
              Appointments will appear here
            </Text>
          </View>
        ) : (
          filteredAppointments.map((appointment) => {
            const salon = salons[appointment.salonId];
            const bookingServices = appointment.serviceIds.map(
              (id) => services[id]
            );
            const totalDuration = bookingServices.reduce((total, s) => {
              const duration = s?.duration || "0";
              const minutes = parseInt(duration);
              return total + (isNaN(minutes) ? 0 : minutes);
            }, 0);

            return (
              <View key={appointment.id} style={styles.appointmentCard}>
                {/* Header: Customer and Status */}
                <View style={styles.appointmentHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.customerName}>
                      {appointment.customerId}
                    </Text>
                    {appointment.customerPhone && (
                      <Text style={styles.customerContact}>
                        📞 {appointment.customerPhone}
                      </Text>
                    )}
                    {appointment.customerEmail && (
                      <Text style={styles.customerContact}>
                        ✉️ {appointment.customerEmail}
                      </Text>
                    )}
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          getStatusColor(appointment.status) + "20",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(appointment.status) },
                      ]}
                    >
                      {appointment.status}
                    </Text>
                  </View>
                </View>

                {/* Booking ID */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Booking ID:</Text>
                  <Text style={styles.detailValue}>{appointment.id}</Text>
                </View>

                {/* Services */}
                <View style={styles.servicesSection}>
                  <Text style={styles.servicesLabel}>Services:</Text>
                  {bookingServices.map((s) =>
                    s ? (
                      <View key={s.id} style={styles.serviceItem}>
                        <Text style={styles.serviceName}>• {s.name}</Text>
                        <Text style={styles.servicePrice}>${s.price}</Text>
                        <Text style={styles.serviceDuration}>
                          {s.duration} min
                        </Text>
                      </View>
                    ) : null
                  )}
                  {bookingServices.length > 0 && (
                    <Text style={styles.totalDuration}>
                      Total Duration: {totalDuration} min
                    </Text>
                  )}
                </View>

                {/* Date, Time, Address */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date:</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(appointment.date)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Time:</Text>
                  <Text style={styles.detailValue}>{appointment.time}</Text>
                </View>
                {salon?.address && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Location:</Text>
                    <Text style={styles.detailValue}>{salon.address}</Text>
                  </View>
                )}

                {/* Payment Status and Total */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Payment:</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      {
                        color:
                          appointment.paymentStatus === "paid"
                            ? "#4CAF50"
                            : "#FFA500",
                      },
                    ]}
                  >
                    {appointment.paymentStatus
                      ? appointment.paymentStatus.toUpperCase()
                      : "N/A"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total:</Text>
                  <Text style={[styles.detailValue, { fontWeight: "bold" }]}>
                    ${appointment.totalPrice || 0}
                  </Text>
                </View>

                {/* Notes */}
                {appointment.notes ? (
                  <View style={styles.notesSection}>
                    <Text style={styles.notesLabel}>Notes:</Text>
                    <Text style={styles.notesText}>{appointment.notes}</Text>
                  </View>
                ) : null}

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.actionButtonSecondary}>
                    <Text style={styles.actionButtonSecondaryText}>
                      Contact
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButtonPrimary}>
                    <Text style={styles.actionButtonPrimaryText}>Details</Text>
                  </TouchableOpacity>
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
    backgroundColor: theme.colors?.white || "#F8F9FA",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors?.white || "#fff",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  filterTabActive: {
    backgroundColor: "#6C5CE7",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  filterTextActive: {
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  appointmentCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  customerContact: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
    marginTop: 2,
  },
  detailLabel: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: "#222",
    fontWeight: "500",
    flexShrink: 1,
    textAlign: "right",
  },
  servicesSection: {
    marginTop: 8,
    marginBottom: 8,
  },
  servicesLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    gap: 8,
  },
  serviceName: {
    fontSize: 14,
    color: "#444",
    flex: 1,
  },
  servicePrice: {
    fontSize: 14,
    color: "#6C5CE7",
    fontWeight: "600",
    marginLeft: 8,
  },
  serviceDuration: {
    fontSize: 13,
    color: "#888",
    marginLeft: 8,
  },
  totalDuration: {
    fontSize: 13,
    color: "#888",
    fontStyle: "italic",
    marginTop: 2,
    marginBottom: 2,
    textAlign: "right",
  },
  notesSection: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    marginBottom: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  notesText: {
    fontSize: 14,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButtonSecondary: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#6C5CE7",
    alignItems: "center",
  },
  actionButtonSecondaryText: {
    color: "#6C5CE7",
    fontSize: 14,
    fontWeight: "600",
  },
  actionButtonPrimary: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#6C5CE7",
    alignItems: "center",
  },
  actionButtonPrimaryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
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
