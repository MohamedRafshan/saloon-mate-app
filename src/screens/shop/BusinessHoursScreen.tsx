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

const DAYS = [
  { id: "monday", name: "Monday" },
  { id: "tuesday", name: "Tuesday" },
  { id: "wednesday", name: "Wednesday" },
  { id: "thursday", name: "Thursday" },
  { id: "friday", name: "Friday" },
  { id: "saturday", name: "Saturday" },
  { id: "sunday", name: "Sunday" },
];

const TIME_SLOTS = [
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
];

interface DayHours {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export function BusinessHoursScreen() {
  const [hours, setHours] = useState<DayHours[]>([
    { day: "monday", open: "09:00", close: "18:00", closed: false },
    { day: "tuesday", open: "09:00", close: "18:00", closed: false },
    { day: "wednesday", open: "09:00", close: "18:00", closed: false },
    { day: "thursday", open: "09:00", close: "18:00", closed: false },
    { day: "friday", open: "09:00", close: "18:00", closed: false },
    { day: "saturday", open: "10:00", close: "16:00", closed: false },
    { day: "sunday", open: "10:00", close: "16:00", closed: true },
  ]);

  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<"open" | "close" | null>(
    null
  );

  const toggleDay = (day: string) => {
    setHours(
      hours.map((h) => (h.day === day ? { ...h, closed: !h.closed } : h))
    );
  };

  const updateTime = (day: string, field: "open" | "close", time: string) => {
    setHours(hours.map((h) => (h.day === day ? { ...h, [field]: time } : h)));
    setEditingDay(null);
    setEditingField(null);
  };

  const openTimePicker = (day: string, field: "open" | "close") => {
    setEditingDay(day);
    setEditingField(field);
  };

  const handleSave = () => {
    Alert.alert("Success", "Business hours updated successfully!");
  };

  const getDayName = (day: string) => {
    return DAYS.find((d) => d.id === day)?.name || day;
  };

  const renderTimePicker = () => {
    if (!editingDay || !editingField) return null;

    const dayHours = hours.find((h) => h.day === editingDay);
    if (!dayHours) return null;

    return (
      <View style={styles.timePickerOverlay}>
        <View style={styles.timePickerContainer}>
          <View style={styles.timePickerHeader}>
            <Text style={styles.timePickerTitle}>
              Select {editingField === "open" ? "Opening" : "Closing"} Time
            </Text>
            <TouchableOpacity
              onPress={() => {
                setEditingDay(null);
                setEditingField(null);
              }}
            >
              <Text style={styles.timePickerClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.timeSlotsList}>
            {TIME_SLOTS.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  dayHours[editingField] === time && styles.timeSlotActive,
                ]}
                onPress={() => updateTime(editingDay, editingField, time)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    dayHours[editingField] === time &&
                      styles.timeSlotTextActive,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Business Hours</Text>
        <Text style={styles.headerSubtitle}>
          Set your opening and closing times
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {hours.map((dayHours) => (
          <View key={dayHours.day} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <View style={styles.dayInfo}>
                <Text style={styles.dayName}>{getDayName(dayHours.day)}</Text>
                {dayHours.closed && (
                  <Text style={styles.closedLabel}>Closed</Text>
                )}
              </View>
              <Switch
                value={!dayHours.closed}
                onValueChange={() => toggleDay(dayHours.day)}
                trackColor={{ false: "#D1D5DB", true: "#6C5CE7" }}
                thumbColor="#fff"
              />
            </View>

            {!dayHours.closed && (
              <View style={styles.timeRow}>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => openTimePicker(dayHours.day, "open")}
                >
                  <Text style={styles.timeLabel}>Open</Text>
                  <Text style={styles.timeValue}>{dayHours.open}</Text>
                </TouchableOpacity>

                <Text style={styles.timeSeparator}>—</Text>

                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => openTimePicker(dayHours.day, "close")}
                >
                  <Text style={styles.timeLabel}>Close</Text>
                  <Text style={styles.timeValue}>{dayHours.close}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>

      {renderTimePicker()}
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
  dayCard: {
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
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dayInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dayName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  closedLabel: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "600",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeButton: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  timeLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  timeSeparator: {
    fontSize: 20,
    color: "#9CA3AF",
    marginHorizontal: 12,
  },
  saveButton: {
    backgroundColor: "#6C5CE7",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  timePickerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  timePickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "80%",
    maxHeight: "70%",
    overflow: "hidden",
  },
  timePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  timePickerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  timePickerClose: {
    fontSize: 24,
    color: "#6B7280",
  },
  timeSlotsList: {
    maxHeight: 400,
  },
  timeSlot: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  timeSlotActive: {
    backgroundColor: "#EEF2FF",
  },
  timeSlotText: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
  },
  timeSlotTextActive: {
    color: "#6C5CE7",
    fontWeight: "600",
  },
});
