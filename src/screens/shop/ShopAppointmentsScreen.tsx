import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export function ShopAppointmentsScreen() {
  const [filter, setFilter] = useState<"today" | "upcoming" | "past">("today");

  const appointments = {
    today: [
      {
        id: "1",
        customer: "John Doe",
        service: "Haircut",
        time: "10:00 AM",
        status: "confirmed",
      },
      {
        id: "2",
        customer: "Jane Smith",
        service: "Hair Color",
        time: "11:30 AM",
        status: "confirmed",
      },
      {
        id: "3",
        customer: "Mike Johnson",
        service: "Beard Trim",
        time: "2:00 PM",
        status: "pending",
      },
      {
        id: "4",
        customer: "Sarah Williams",
        service: "Manicure",
        time: "3:30 PM",
        status: "confirmed",
      },
    ],
    upcoming: [
      {
        id: "5",
        customer: "David Brown",
        service: "Haircut",
        time: "Tomorrow 10:00 AM",
        status: "confirmed",
      },
      {
        id: "6",
        customer: "Emma Davis",
        service: "Facial",
        time: "Tomorrow 2:00 PM",
        status: "confirmed",
      },
    ],
    past: [
      {
        id: "7",
        customer: "James Wilson",
        service: "Haircut",
        time: "Yesterday 4:00 PM",
        status: "completed",
      },
      {
        id: "8",
        customer: "Olivia Taylor",
        service: "Pedicure",
        time: "Yesterday 5:30 PM",
        status: "completed",
      },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "#00C853";
      case "pending":
        return "#FFA726";
      case "completed":
        return "#666";
      default:
        return "#666";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Appointments</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
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
            Upcoming
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {appointments[filter].map((appointment) => (
          <View key={appointment.id} style={styles.appointmentCard}>
            <View style={styles.appointmentHeader}>
              <Text style={styles.customerName}>{appointment.customer}</Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: getStatusColor(appointment.status) + "20",
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
            <Text style={styles.serviceName}>{appointment.service}</Text>
            <Text style={styles.appointmentTime}>🕐 {appointment.time}</Text>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButtonSecondary}>
                <Text style={styles.actionButtonSecondaryText}>Contact</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButtonPrimary}>
                <Text style={styles.actionButtonPrimaryText}>Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  serviceName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  appointmentTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
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
});
