import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export function ShopServicesScreen() {
  const services = [
    {
      id: "1",
      name: "Classic Haircut",
      price: "$30",
      duration: "30 mins",
      category: "Hair",
    },
    {
      id: "2",
      name: "Hair Coloring",
      price: "$80",
      duration: "2 hours",
      category: "Hair",
    },
    {
      id: "3",
      name: "Beard Trim",
      price: "$20",
      duration: "20 mins",
      category: "Grooming",
    },
    {
      id: "4",
      name: "Manicure",
      price: "$25",
      duration: "45 mins",
      category: "Nails",
    },
    {
      id: "5",
      name: "Pedicure",
      price: "$35",
      duration: "1 hour",
      category: "Nails",
    },
    {
      id: "6",
      name: "Facial Treatment",
      price: "$60",
      duration: "1 hour",
      category: "Spa",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Services</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Service</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {services.map((service) => (
          <View key={service.id} style={styles.serviceCard}>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{service.category}</Text>
              </View>
              <View style={styles.serviceDetails}>
                <Text style={styles.serviceDetailText}>💰 {service.price}</Text>
                <Text style={styles.serviceDetailText}>
                  • ⏱️ {service.duration}
                </Text>
              </View>
            </View>
            <View style={styles.serviceActions}>
              <TouchableOpacity style={styles.iconButton}>
                <Text style={styles.iconButtonText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Text style={styles.iconButtonText}>🗑️</Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  addButton: {
    backgroundColor: "#6C5CE7",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  serviceCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#F0EDFF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6C5CE7",
  },
  serviceDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceDetailText: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  serviceActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  iconButtonText: {
    fontSize: 18,
  },
});
