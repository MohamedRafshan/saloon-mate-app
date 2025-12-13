import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SERVICE_CATEGORIES } from "../constants/categories";
import { Staff } from "../types/Staff";

interface StaffModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (staff: Partial<Staff>) => void;
  staff?: Staff | null;
}

export function StaffModal({
  visible,
  onClose,
  onSave,
  staff,
}: StaffModalProps) {
  const [name, setName] = useState(staff?.name || "");
  const [email, setEmail] = useState(staff?.email || "");
  const [phone, setPhone] = useState(staff?.phone || "");
  const [role, setRole] = useState(staff?.role || "");
  const [specialties, setSpecialties] = useState<string[]>(
    staff?.specialties || []
  );

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter staff name");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Error", "Please enter email address");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("Error", "Please enter phone number");
      return;
    }
    if (!role.trim()) {
      Alert.alert("Error", "Please enter role/position");
      return;
    }

    onSave({
      id: staff?.id,
      name,
      email,
      phone,
      role,
      specialties,
      active: staff?.active ?? true,
    });
    handleClose();
  };

  const handleClose = () => {
    setName("");
    setEmail("");
    setPhone("");
    setRole("");
    setSpecialties([]);
    onClose();
  };

  const toggleSpecialty = (categoryId: string) => {
    if (specialties.includes(categoryId)) {
      setSpecialties(specialties.filter((s) => s !== categoryId));
    } else {
      setSpecialties([...specialties, categoryId]);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {staff ? "Edit Staff Member" : "Add Staff Member"}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., John Smith"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="john@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="+1 234 567 8900"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Role/Position *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Senior Stylist"
                value={role}
                onChangeText={setRole}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Specialties</Text>
              <Text style={styles.sublabel}>
                Select the service categories this staff member specializes in
              </Text>
              <View style={styles.specialtyGrid}>
                {SERVICE_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.specialtyChip,
                      specialties.includes(cat.id) &&
                        styles.specialtyChipActive,
                    ]}
                    onPress={() => toggleSpecialty(cat.id)}
                  >
                    <Text style={styles.specialtyIcon}>{cat.icon}</Text>
                    <Text
                      style={[
                        styles.specialtyName,
                        specialties.includes(cat.id) &&
                          styles.specialtyNameActive,
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save Staff</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "90%",
    maxHeight: "90%",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  closeButton: {
    fontSize: 24,
    color: "#6B7280",
  },
  content: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  sublabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  specialtyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  specialtyChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
  },
  specialtyChipActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  specialtyIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  specialtyName: {
    fontSize: 14,
    color: "#374151",
  },
  specialtyNameActive: {
    color: "white",
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
  },
  cancelButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#3B82F6",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
