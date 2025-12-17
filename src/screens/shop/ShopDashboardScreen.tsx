import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { bookingService } from "../../api/bookingService";
import { authService, AuthUser } from "../../services/authService";
import { reviewService } from "../../services/reviewService";
import { Booking } from "../../types/Booking";
import { Review } from "../../types/Review";

export function ShopDashboardScreen() {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authUnsubscribe = authService.subscribe((authUser) => {
      setUser(authUser);
      if (authUser?.businessId) {
        const bookingUnsubscribe = bookingService.subscribeToSalonBookings(
          authUser.businessId,
          (newBookings) => {
            setBookings(newBookings);
            setLoading(false);
          }
        );

        const reviewUnsubscribe = reviewService.subscribeToSalonReviews(
          authUser.businessId,
          (newReviews) => {
            setReviews(newReviews);
          }
        );

        return () => {
          bookingUnsubscribe();
          reviewUnsubscribe();
        };
      }
      setLoading(false);
      return () => {};
    });

    return () => authUnsubscribe();
  }, []);

  const getTodayBookings = () => {
    const today = new Date().toISOString().split("T")[0];
    return bookings.filter((b) => b.date === today);
  };

  const getThisWeekBookings = () => {
    const today = new Date();
    const firstDayOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    )
      .toISOString()
      .split("T")[0];
    return bookings.filter((b) => b.date >= firstDayOfWeek);
  };

  const calculateRevenue = () => {
    return bookings
      .filter((b) => b.status === "completed")
      .reduce((acc, b) => acc + b.totalPrice, 0);
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return "N/A";
    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const stats = [
    {
      label: "Today's Bookings",
      value: getTodayBookings().length.toString(),
      icon: "📅",
    },
    {
      label: "This Week",
      value: getThisWeekBookings().length.toString(),
      icon: "📊",
    },
    {
      label: "Revenue",
      value: `$${calculateRevenue().toFixed(2)}`,
      icon: "💰",
    },
    { label: "Rating", value: calculateAverageRating(), icon: "⭐" },
  ];

  const recentBookings = bookings
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Business Dashboard</Text>
        <Text style={styles.headerSubtitle}>
          Welcome back, {user?.name || "User"}!
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Recent Bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Bookings</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("ShopAppointments")}
            >
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {recentBookings.length > 0 ? (
            recentBookings.map((booking) => (
              <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingInfo}>
                  <Text style={styles.customerName}>
                    Booking #{booking.id.substring(0, 5)}
                  </Text>
                  <Text style={styles.serviceName}>
                    {booking.date} at {booking.time}
                  </Text>
                </View>
                <Text style={styles.bookingTime}>${booking.totalPrice}</Text>
              </View>
            ))
          ) : (
            <Text>No recent bookings.</Text>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("ShopServices")}
            >
              <Text style={styles.actionIcon}>➕</Text>
              <Text style={styles.actionText}>Add Service</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("StaffManagement")}
            >
              <Text style={styles.actionIcon}>👥</Text>
              <Text style={styles.actionText}>Manage Staff</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("BusinessHours")}
            >
              <Text style={styles.actionIcon}>⏰</Text>
              <Text style={styles.actionText}>Set Hours</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("Analytics")}
            >
              <Text style={styles.actionIcon}>📈</Text>
              <Text style={styles.actionText}>Analytics</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#6C5CE7",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#E8E5FF",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  seeAllText: {
    fontSize: 14,
    color: "#6C5CE7",
    fontWeight: "500",
  },
  bookingCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bookingInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 14,
    color: "#666",
  },
  bookingTime: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6C5CE7",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
  },
});