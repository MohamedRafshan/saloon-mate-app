import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { bookingService } from "../../api/bookingService";
import { mockAPI } from "../../api/mock";
import { theme } from "../../theme";
import { Service } from "../../types/Service";

export const BookingFormScreen = ({ route, navigation }: any) => {
  const { salonId, salonName } = route.params;

  // Form state
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Date/Time picker visibility
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    loadServices();
  }, [salonId]);

  const loadServices = async () => {
    try {
      const servicesData = await mockAPI.getServicesBySalonId(salonId);
      setServices(servicesData);
    } catch (error) {
      Alert.alert("Error", "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (serviceId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const calculateTotalPrice = () => {
    return selectedServiceIds.reduce((total, serviceId) => {
      const service = services.find((s) => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const formatTime = (time: Date) => {
    return time.toTimeString().split(" ")[0].substring(0, 5);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      setSelectedTime(selectedTime);
    }
  };

  const handleSubmitBooking = async () => {
    // Validation
    if (selectedServiceIds.length === 0) {
      Alert.alert("Error", "Please select at least one service");
      return;
    }

    // Check if date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      Alert.alert("Error", "Please select a future date");
      return;
    }

    setSubmitting(true);

    try {
      // TODO: Get actual user ID from auth context/service
      const userId = "user1"; // This should come from your auth service

      const bookingData = {
        customerId: userId,
        salonId: salonId,
        serviceIds: selectedServiceIds,
        date: formatDate(selectedDate),
        time: formatTime(selectedTime),
        totalPrice: calculateTotalPrice(),
        notes: notes.trim() || undefined,
      };

      await bookingService.createBooking(bookingData);

      Alert.alert("Success", "Your appointment has been booked successfully!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to book appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const totalPrice = calculateTotalPrice();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Book Appointment</Text>
        <Text style={styles.salonName}>{salonName}</Text>
      </View>

      {/* Services Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Services *</Text>
        {services.length === 0 ? (
          <Text style={styles.emptyText}>No services available</Text>
        ) : (
          services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[
                styles.serviceCard,
                selectedServiceIds.includes(service.id) &&
                  styles.serviceCardSelected,
              ]}
              onPress={() => toggleService(service.id)}
            >
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDetails}>
                  {service.duration} • ${service.price}
                </Text>
                {service.description && (
                  <Text style={styles.serviceDescription} numberOfLines={2}>
                    {service.description}
                  </Text>
                )}
              </View>
              <View
                style={[
                  styles.checkbox,
                  selectedServiceIds.includes(service.id) &&
                    styles.checkboxSelected,
                ]}
              >
                {selectedServiceIds.includes(service.id) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Date Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Date *</Text>
        <TouchableOpacity
          style={styles.dateTimeButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateTimeIcon}>📅</Text>
          <Text style={styles.dateTimeText}>{formatDate(selectedDate)}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      {/* Time Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Time *</Text>
        <TouchableOpacity
          style={styles.dateTimeButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.dateTimeIcon}>🕐</Text>
          <Text style={styles.dateTimeText}>{formatTime(selectedTime)}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onTimeChange}
          />
        )}
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Any special requests or preferences?"
          placeholderTextColor={theme.colors.textSecondary}
          multiline
          numberOfLines={4}
          value={notes}
          onChangeText={setNotes}
          textAlignVertical="top"
        />
      </View>

      {/* Price Summary */}
      {selectedServiceIds.length > 0 && (
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Selected Services:</Text>
            <Text style={styles.summaryValue}>{selectedServiceIds.length}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Price:</Text>
            <Text style={styles.totalValue}>${totalPrice}</Text>
          </View>
        </View>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          (submitting || selectedServiceIds.length === 0) &&
            styles.submitButtonDisabled,
        ]}
        onPress={handleSubmitBooking}
        disabled={submitting || selectedServiceIds.length === 0}
      >
        {submitting ? (
          <ActivityIndicator color={theme.colors.white} />
        ) : (
          <Text style={styles.submitButtonText}>Confirm Booking</Text>
        )}
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.white,
  },
  header: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.backgroundDark,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  salonName: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  section: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.backgroundDark,
  },
  sectionTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    paddingVertical: theme.spacing.lg,
  },
  serviceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundDark,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 2,
    borderColor: "transparent",
  },
  serviceCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: "#F0EDFF",
  },
  serviceInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  serviceName: {
    ...theme.typography.body,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  serviceDetails: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  serviceDescription: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.textSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkmark: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  dateTimeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundDark,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.backgroundDark,
  },
  dateTimeIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  dateTimeText: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
  },
  notesInput: {
    ...theme.typography.body,
    color: theme.colors.text,
    backgroundColor: theme.colors.backgroundDark,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    minHeight: 100,
    borderWidth: 1,
    borderColor: theme.colors.backgroundDark,
  },
  summarySection: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.backgroundDark,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "600",
  },
  totalLabel: {
    ...theme.typography.h4,
    color: theme.colors.text,
  },
  totalValue: {
    ...theme.typography.h4,
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: theme.colors.textSecondary,
    opacity: 0.5,
  },
  submitButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.md,
    fontWeight: "bold",
  },
  bottomPadding: {
    height: theme.spacing.xl,
  },
});
