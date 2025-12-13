import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface ChartData {
  label: string;
  value: number;
  color: string;
}

export function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "year"
  >("week");

  // Sample data
  const stats = [
    {
      label: "Total Revenue",
      value: "$12,450",
      change: "+12%",
      icon: "💰",
      color: "#10B981",
    },
    {
      label: "Total Bookings",
      value: "248",
      change: "+8%",
      icon: "📅",
      color: "#6366F1",
    },
    {
      label: "New Customers",
      value: "42",
      change: "+15%",
      icon: "👥",
      color: "#F59E0B",
    },
    {
      label: "Avg. Rating",
      value: "4.8",
      change: "+0.2",
      icon: "⭐",
      color: "#EC4899",
    },
  ];

  const revenueData: ChartData[] = [
    { label: "Mon", value: 1200, color: "#6366F1" },
    { label: "Tue", value: 1800, color: "#6366F1" },
    { label: "Wed", value: 1500, color: "#6366F1" },
    { label: "Thu", value: 2200, color: "#6366F1" },
    { label: "Fri", value: 2800, color: "#6366F1" },
    { label: "Sat", value: 3200, color: "#6366F1" },
    { label: "Sun", value: 2500, color: "#6366F1" },
  ];

  const topServices = [
    { name: "Classic Haircut", bookings: 45, revenue: "$1,350", icon: "💇" },
    { name: "Hair Coloring", bookings: 32, revenue: "$2,560", icon: "🎨" },
    { name: "Manicure", bookings: 28, revenue: "$700", icon: "💅" },
    { name: "Facial Treatment", bookings: 24, revenue: "$1,440", icon: "🧖" },
    { name: "Beard Trim", bookings: 22, revenue: "$440", icon: "✂️" },
  ];

  const peakHours = [
    { time: "09:00 - 11:00", bookings: 35, percentage: 70 },
    { time: "11:00 - 13:00", bookings: 42, percentage: 84 },
    { time: "13:00 - 15:00", bookings: 38, percentage: 76 },
    { time: "15:00 - 17:00", bookings: 50, percentage: 100 },
    { time: "17:00 - 19:00", bookings: 45, percentage: 90 },
  ];

  const maxRevenue = Math.max(...revenueData.map((d) => d.value));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <Text style={styles.headerSubtitle}>Business Performance</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(["week", "month", "year"] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive,
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={[styles.statChange, { color: stat.color }]}>
                {stat.change}
              </Text>
            </View>
          ))}
        </View>

        {/* Revenue Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Revenue Overview</Text>
          <View style={styles.chartContainer}>
            <View style={styles.chart}>
              {revenueData.map((data, index) => {
                const barHeight = (data.value / maxRevenue) * 150;
                return (
                  <View key={index} style={styles.barContainer}>
                    <View style={styles.barWrapper}>
                      <Text style={styles.barValue}>
                        ${(data.value / 1000).toFixed(1)}k
                      </Text>
                      <View
                        style={[
                          styles.bar,
                          {
                            height: barHeight,
                            backgroundColor: data.color,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.barLabel}>{data.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Top Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Services</Text>
          {topServices.map((service, index) => (
            <View key={index} style={styles.serviceRow}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceIcon}>{service.icon}</Text>
                <View>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceBookings}>
                    {service.bookings} bookings
                  </Text>
                </View>
              </View>
              <Text style={styles.serviceRevenue}>{service.revenue}</Text>
            </View>
          ))}
        </View>

        {/* Peak Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Peak Hours</Text>
          {peakHours.map((hour, index) => (
            <View key={index} style={styles.peakHourRow}>
              <Text style={styles.peakHourTime}>{hour.time}</Text>
              <View style={styles.peakHourBarContainer}>
                <View
                  style={[styles.peakHourBar, { width: `${hour.percentage}%` }]}
                />
              </View>
              <Text style={styles.peakHourBookings}>{hour.bookings}</Text>
            </View>
          ))}
        </View>

        {/* Customer Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Insights</Text>
          <View style={styles.insightGrid}>
            <View style={styles.insightCard}>
              <Text style={styles.insightValue}>68%</Text>
              <Text style={styles.insightLabel}>Repeat Customers</Text>
            </View>
            <View style={styles.insightCard}>
              <Text style={styles.insightValue}>4.2</Text>
              <Text style={styles.insightLabel}>Visits per Customer</Text>
            </View>
            <View style={styles.insightCard}>
              <Text style={styles.insightValue}>$85</Text>
              <Text style={styles.insightLabel}>Avg. Transaction</Text>
            </View>
            <View style={styles.insightCard}>
              <Text style={styles.insightValue}>92%</Text>
              <Text style={styles.insightLabel}>Satisfaction Rate</Text>
            </View>
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  periodSelector: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: "#6C5CE7",
  },
  periodButtonText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  periodButtonTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: (width - 52) / 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
  },
  statChange: {
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  chartContainer: {
    paddingVertical: 10,
  },
  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 180,
  },
  barContainer: {
    flex: 1,
    alignItems: "center",
  },
  barWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
  },
  bar: {
    width: "60%",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginTop: 4,
  },
  barValue: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 8,
  },
  serviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  serviceInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  serviceIcon: {
    fontSize: 24,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  serviceBookings: {
    fontSize: 12,
    color: "#6B7280",
  },
  serviceRevenue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10B981",
  },
  peakHourRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  peakHourTime: {
    fontSize: 12,
    color: "#6B7280",
    width: 100,
  },
  peakHourBarContainer: {
    flex: 1,
    height: 24,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 12,
  },
  peakHourBar: {
    height: "100%",
    backgroundColor: "#6C5CE7",
    borderRadius: 12,
  },
  peakHourBookings: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    width: 30,
    textAlign: "right",
  },
  insightGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  insightCard: {
    width: (width - 84) / 2,
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    alignItems: "center",
  },
  insightValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6C5CE7",
    marginBottom: 4,
  },
  insightLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
});
