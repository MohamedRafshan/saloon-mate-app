import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ServiceModal } from "../../components/ServiceModal";
import { SERVICE_CATEGORIES } from "../../constants/categories";
import { authService } from "../../services/authService";
import { serviceService } from "../../services/serviceService";
import { Service } from "../../types/Service";

export function ShopServicesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [services, setServices] = useState<Service[]>([]);
  const [salonId, setSalonId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const user = await authService.getUser();
      const bId = user?.businessId || null;
      if (!mounted) return;
      setSalonId(bId);
      if (bId) {
        const list = await serviceService.getBySalonId(bId);
        if (mounted) setServices(list);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleAddService = () => {
    setSelectedService(null);
    setModalVisible(true);
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setModalVisible(true);
  };

  const handleDeleteService = (serviceId: string) => {
    Alert.alert(
      "Delete Service",
      "Are you sure you want to delete this service?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await serviceService.remove(serviceId);
              setServices(services.filter((s) => s.id !== serviceId));
            } catch (e) {
              Alert.alert("Error", "Failed to delete service.");
            }
          },
        },
      ]
    );
  };

  const handleSaveService = async (service: Partial<Service>) => {
    try {
      if (service.id) {
        const updated = await serviceService.update(service.id, service);
        setServices(services.map((s) => (s.id === updated.id ? updated : s)));
      } else {
        if (!salonId) {
          Alert.alert("Error", "No salon context found.");
          return;
        }
        const created = await serviceService.create(salonId, service);
        setServices([created, ...services]);
      }
    } catch (e) {
      Alert.alert("Error", "Failed to save service.");
    }
  };

  const filteredServices = selectedCategory
    ? services.filter((s) => s.category === selectedCategory)
    : services;

  const getCategoryInfo = (categoryId: string) => {
    return SERVICE_CATEGORIES.find((c) => c.id === categoryId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Services ({services.length})</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddService}>
          <Text style={styles.addButtonText}>+ Add Service</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryFilter}
        contentContainerStyle={styles.categoryFilterContent}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            !selectedCategory && styles.filterChipActive,
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text
            style={[
              styles.filterChipText,
              !selectedCategory && styles.filterChipTextActive,
            ]}
          >
            All ({services.length})
          </Text>
        </TouchableOpacity>
        {SERVICE_CATEGORIES.map((cat) => {
          const count = services.filter((s) => s.category === cat.id).length;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.filterChip,
                selectedCategory === cat.id && styles.filterChipActive,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={styles.filterChipIcon}>{cat.icon}</Text>
              <Text
                style={[
                  styles.filterChipText,
                  selectedCategory === cat.id && styles.filterChipTextActive,
                ]}
              >
                {cat.name} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredServices.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📋</Text>
            <Text style={styles.emptyStateText}>No services found</Text>
            <Text style={styles.emptyStateSubtext}>
              {selectedCategory
                ? "No services in this category"
                : "Add your first service to get started"}
            </Text>
          </View>
        ) : (
          filteredServices.map((service) => {
            const categoryInfo = getCategoryInfo(service.category);
            return (
              <View key={service.id} style={styles.serviceCard}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  {categoryInfo && (
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryIcon}>
                        {categoryInfo.icon}
                      </Text>
                      <Text style={styles.categoryText}>
                        {categoryInfo.name}
                      </Text>
                    </View>
                  )}
                  <View style={styles.serviceDetails}>
                    <Text style={styles.serviceDetailText}>
                      💰 ${service.price}
                    </Text>
                    <Text style={styles.serviceDetailText}>
                      • ⏱️ {service.duration}
                    </Text>
                  </View>
                  {service.description && (
                    <Text style={styles.serviceDescription}>
                      {service.description}
                    </Text>
                  )}
                </View>
                <View style={styles.serviceActions}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => handleEditService(service)}
                  >
                    <Text style={styles.iconButtonText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => handleDeleteService(service.id)}
                  >
                    <Text style={styles.iconButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <ServiceModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveService}
        service={selectedService}
      />
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
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#F0EDFF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 12,
    marginRight: 4,
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
  serviceDescription: {
    fontSize: 13,
    color: "#666",
    marginTop: 8,
    fontStyle: "italic",
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
  categoryFilter: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  categoryFilterContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F8F9FA",
  },
  filterChipActive: {
    backgroundColor: "#6C5CE7",
    borderColor: "#6C5CE7",
  },
  filterChipIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  filterChipText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});
