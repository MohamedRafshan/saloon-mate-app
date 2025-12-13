import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StaffModal } from "../../components/StaffModal";
import { SERVICE_CATEGORIES } from "../../constants/categories";
import { Staff } from "../../types/Staff";

export function StaffManagementScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const [staffMembers, setStaffMembers] = useState<Staff[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@luxesalon.com",
      phone: "+1 234 567 8901",
      role: "Senior Stylist",
      specialties: ["hair", "makeup"],
      rating: 4.9,
      active: true,
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael@luxesalon.com",
      phone: "+1 234 567 8902",
      role: "Barber",
      specialties: ["hair", "grooming"],
      rating: 4.8,
      active: true,
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      email: "emily@luxesalon.com",
      phone: "+1 234 567 8903",
      role: "Nail Technician",
      specialties: ["nails"],
      rating: 4.7,
      active: true,
    },
    {
      id: "4",
      name: "David Thompson",
      email: "david@luxesalon.com",
      phone: "+1 234 567 8904",
      role: "Spa Therapist",
      specialties: ["spa", "massage", "skincare"],
      rating: 4.9,
      active: false,
    },
  ]);

  const handleAddStaff = () => {
    setSelectedStaff(null);
    setModalVisible(true);
  };

  const handleEditStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    setModalVisible(true);
  };

  const handleDeleteStaff = (staffId: string) => {
    Alert.alert(
      "Delete Staff Member",
      "Are you sure you want to remove this staff member?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setStaffMembers(staffMembers.filter((s) => s.id !== staffId));
          },
        },
      ]
    );
  };

  const handleSaveStaff = (staff: Partial<Staff>) => {
    if (staff.id) {
      // Update existing staff
      setStaffMembers(
        staffMembers.map((s) =>
          s.id === staff.id ? ({ ...s, ...staff } as Staff) : s
        )
      );
    } else {
      // Add new staff
      const newStaff: Staff = {
        ...staff,
        id: Date.now().toString(),
        rating: 0,
      } as Staff;
      setStaffMembers([...staffMembers, newStaff]);
    }
  };

  const toggleStaffActive = (staffId: string) => {
    setStaffMembers(
      staffMembers.map((s) =>
        s.id === staffId ? { ...s, active: !s.active } : s
      )
    );
  };

  const getCategoryInfo = (categoryId: string) => {
    return SERVICE_CATEGORIES.find((c) => c.id === categoryId);
  };

  const activeStaff = staffMembers.filter((s) => s.active);
  const inactiveStaff = staffMembers.filter((s) => !s.active);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Staff Management</Text>
          <Text style={styles.headerSubtitle}>
            {activeStaff.length} active • {inactiveStaff.length} inactive
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddStaff}>
          <Text style={styles.addButtonText}>+ Add Staff</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Active Staff */}
        {activeStaff.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Active Staff</Text>
            {activeStaff.map((staff) => (
              <View key={staff.id} style={styles.staffCard}>
                <View style={styles.staffHeader}>
                  <View style={styles.staffAvatar}>
                    <Text style={styles.staffAvatarText}>
                      {staff.name.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.staffInfo}>
                    <Text style={styles.staffName}>{staff.name}</Text>
                    <Text style={styles.staffRole}>{staff.role}</Text>
                    {staff.rating && (
                      <View style={styles.ratingContainer}>
                        <Text style={styles.ratingIcon}>⭐</Text>
                        <Text style={styles.ratingText}>{staff.rating}</Text>
                      </View>
                    )}
                  </View>
                  <Switch
                    value={staff.active}
                    onValueChange={() => toggleStaffActive(staff.id)}
                    trackColor={{ false: "#D1D5DB", true: "#10B981" }}
                    thumbColor="#fff"
                  />
                </View>

                <View style={styles.staffDetails}>
                  <View style={styles.contactRow}>
                    <Text style={styles.contactIcon}>📧</Text>
                    <Text style={styles.contactText}>{staff.email}</Text>
                  </View>
                  <View style={styles.contactRow}>
                    <Text style={styles.contactIcon}>📱</Text>
                    <Text style={styles.contactText}>{staff.phone}</Text>
                  </View>
                </View>

                {staff.specialties.length > 0 && (
                  <View style={styles.specialtiesContainer}>
                    <Text style={styles.specialtiesLabel}>Specialties:</Text>
                    <View style={styles.specialtyTags}>
                      {staff.specialties.map((specialtyId) => {
                        const category = getCategoryInfo(specialtyId);
                        return category ? (
                          <View key={specialtyId} style={styles.specialtyTag}>
                            <Text style={styles.specialtyTagIcon}>
                              {category.icon}
                            </Text>
                            <Text style={styles.specialtyTagText}>
                              {category.name}
                            </Text>
                          </View>
                        ) : null;
                      })}
                    </View>
                  </View>
                )}

                <View style={styles.staffActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEditStaff(staff)}
                  >
                    <Text style={styles.actionButtonText}>✏️ Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteStaff(staff.id)}
                  >
                    <Text style={styles.deleteButtonText}>🗑️ Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Inactive Staff */}
        {inactiveStaff.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Inactive Staff</Text>
            {inactiveStaff.map((staff) => (
              <View
                key={staff.id}
                style={[styles.staffCard, styles.inactiveCard]}
              >
                <View style={styles.staffHeader}>
                  <View style={[styles.staffAvatar, styles.inactiveAvatar]}>
                    <Text style={styles.staffAvatarText}>
                      {staff.name.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.staffInfo}>
                    <Text style={styles.staffName}>{staff.name}</Text>
                    <Text style={styles.staffRole}>{staff.role}</Text>
                  </View>
                  <Switch
                    value={staff.active}
                    onValueChange={() => toggleStaffActive(staff.id)}
                    trackColor={{ false: "#D1D5DB", true: "#10B981" }}
                    thumbColor="#fff"
                  />
                </View>
              </View>
            ))}
          </>
        )}

        {staffMembers.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>👥</Text>
            <Text style={styles.emptyStateText}>No staff members yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Add your first staff member to get started
            </Text>
          </View>
        )}
      </ScrollView>

      <StaffModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveStaff}
        staff={selectedStaff}
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
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
    marginTop: 8,
  },
  staffCard: {
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
  inactiveCard: {
    opacity: 0.6,
  },
  staffHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  staffAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#6C5CE7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  inactiveAvatar: {
    backgroundColor: "#9CA3AF",
  },
  staffAvatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  staffRole: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F59E0B",
  },
  staffDetails: {
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  contactIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  contactText: {
    fontSize: 14,
    color: "#6B7280",
  },
  specialtiesContainer: {
    marginBottom: 12,
  },
  specialtiesLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },
  specialtyTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  specialtyTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0EDFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specialtyTagIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  specialtyTagText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6C5CE7",
  },
  staffActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  deleteButton: {
    backgroundColor: "#FEE2E2",
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#DC2626",
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
