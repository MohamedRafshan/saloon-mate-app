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
import { salonService } from "../../api/salonService";
import { authService, AuthUser } from "../../services/authService";
import { theme } from "../../theme";
import { Booking } from "../../types/Booking";
import { Salon } from "../../types/Salon";
import { Service } from "../../types/Service";

export const BookingFormScreen = ({ route, navigation }: any) => {
  const { salonId, salonName } = route.params;

  // Form state
  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState<
    { time: string; isBooked: boolean }[]
  >([]);
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Date picker visibility
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    checkAuthAndLoadData();
  }, [salonId]);

  useEffect(() => {
    if (salon && selectedDate) {
      generateAvailableTimeSlots();
    }
  }, [selectedDate, salon, existingBookings]);

  const checkAuthAndLoadData = async () => {
    try {
      const authenticated = authService.isAuthenticated();
      const firebaseUser = authService.getCurrentFirebaseUser();

      if (!authenticated || !firebaseUser) {
        setIsAuthenticated(false);
        Alert.alert(
          "Authentication Required",
          "Please log in to book an appointment",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]
        );
        return;
      }

      const user = await authService.getUser(firebaseUser.uid);
      if (!user) {
        throw new Error("User not found in database");
      }

      setIsAuthenticated(true);
      setCurrentUser(user);

      const salonData = await salonService.getSalonById(salonId);
      // TODO: Replace getServicesBySalonId and getBookingsBySalonId with Firestore versions if available
      setServices([]); // Placeholder, implement Firestore fetch for services
      setExistingBookings([]); // Placeholder, implement Firestore fetch for bookings
      setSalon(salonData);
    } catch (error) {
      Alert.alert("Error", "Failed to load salon data");
    } finally {
      setLoading(false);
    }
  };

  const generateAvailableTimeSlots = () => {
    if (!salon) return;

    const dayName = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    // Handle both array format and object format for opening hours
    let openingHours;
    if (Array.isArray(salon.openingHours)) {
      openingHours = salon.openingHours.find((hours) => hours.day === dayName);
    } else if (salon.openingHours) {
      // Convert object format to array format
      const dayKey = dayName.toLowerCase();
      const hoursObj = (salon.openingHours as any)[dayKey];
      if (hoursObj) {
        openingHours = {
          day: dayName,
          open: hoursObj.open,
          close: hoursObj.close,
          closed: hoursObj.closed,
        };
      }
    }

    if (!openingHours || openingHours.closed || !openingHours.open) {
      setAvailableTimeSlots([]);
      return;
    }

    // Parse opening and closing times
    const [openHour, openMinute] = openingHours.open.split(":").map(Number);
    const [closeHour, closeMinute] = openingHours.close.split(":").map(Number);

    // Generate 30-minute time slots
    const slots: { time: string; isBooked: boolean }[] = [];
    let currentHour = openHour;
    let currentMinute = openMinute;

    while (
      currentHour < closeHour ||
      (currentHour === closeHour && currentMinute < closeMinute)
    ) {
      const timeSlot = `${String(currentHour).padStart(2, "0")}:${String(
        currentMinute
      ).padStart(2, "0")}`;

      // Check if this time slot conflicts with existing bookings
      const isBooked = isTimeSlotBooked(timeSlot);

      // Add all time slots with their booking status
      slots.push({ time: timeSlot, isBooked });

      // Increment by 30 minutes
      currentMinute += 30;
      if (currentMinute >= 60) {
        currentMinute = 0;
        currentHour += 1;
      }
    }

    setAvailableTimeSlots(slots);
  };

  const isTimeSlotBooked = (timeSlot: string): boolean => {
    const selectedDateStr = formatDate(selectedDate);

    return existingBookings.some((booking) => {
      if (booking.date !== selectedDateStr || booking.status === "cancelled") {
        return false;
      }

      // Check if the time slot overlaps with existing booking
      // Assuming each booking takes at least 30 minutes
      const bookingTime = booking.time.substring(0, 5);
      return bookingTime === timeSlot;
    });
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

  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (date) {
      setSelectedDate(date);
      setSelectedTimeSlot(""); // Reset time slot when date changes
    }
  };

  const handleSubmitBooking = async () => {
    // Validation
    if (selectedServiceIds.length === 0) {
      Alert.alert("Error", "Please select at least one service");
      return;
    }

    if (!selectedTimeSlot) {
      Alert.alert("Error", "Please select a time slot");
      return;
    }

    // Check if date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      Alert.alert("Error", "Please select a future date");
      return;
    }

    // Check if salon is open on selected day
    const dayName = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    let openingHours;

    if (Array.isArray(salon?.openingHours)) {
      openingHours = salon.openingHours.find((hours) => hours.day === dayName);
    } else if (salon?.openingHours) {
      const dayKey = dayName.toLowerCase();
      const hoursObj = (salon.openingHours as any)[dayKey];
      if (hoursObj) {
        openingHours = {
          day: dayName,
          open: hoursObj.open,
          close: hoursObj.close,
          closed: hoursObj.closed,
        };
      }
    }

    if (!openingHours || openingHours.closed || !openingHours.open) {
      Alert.alert("Error", "Salon is closed on the selected day");
      return;
    }

    setSubmitting(true);

    try {
      if (!currentUser) {
        Alert.alert("Error", "User session expired. Please log in again.");
        navigation.goBack();
        return;
      }

      const bookingData = {
        customerId: currentUser.id,
        salonId: salonId,
        serviceIds: selectedServiceIds,
        date: formatDate(selectedDate),
        time: selectedTimeSlot,
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

  if (!isAuthenticated || !currentUser) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>🔒</Text>
        <Text style={styles.errorTitle}>Authentication Required</Text>
        <Text style={styles.errorText}>
          You must be logged in to book an appointment
        </Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
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

      {/* Time Slot Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Time Slot *</Text>
        {availableTimeSlots.length === 0 ? (
          <View style={styles.noSlotsContainer}>
            <Text style={styles.noSlotsIcon}>🔒</Text>
            <Text style={styles.noSlotsText}>
              {(() => {
                const dayName = selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                });
                let isClosed = false;

                if (Array.isArray(salon?.openingHours)) {
                  isClosed =
                    salon.openingHours.find((h) => h.day === dayName)?.closed ||
                    false;
                } else if (salon?.openingHours) {
                  const dayKey = dayName.toLowerCase();
                  isClosed =
                    (salon.openingHours as any)[dayKey]?.closed || false;
                }

                return isClosed
                  ? "Salon is closed on this day"
                  : "No available time slots for this date";
              })()}
            </Text>
          </View>
        ) : (
          <View style={styles.timeSlotsGrid}>
            {availableTimeSlots.map((slot) => (
              <TouchableOpacity
                key={slot.time}
                style={[
                  styles.timeSlot,
                  selectedTimeSlot === slot.time && styles.timeSlotSelected,
                  slot.isBooked && styles.timeSlotBooked,
                ]}
                onPress={() => !slot.isBooked && setSelectedTimeSlot(slot.time)}
                disabled={slot.isBooked}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    selectedTimeSlot === slot.time &&
                      styles.timeSlotTextSelected,
                    slot.isBooked && styles.timeSlotTextBooked,
                  ]}
                >
                  {slot.time}
                </Text>
                {slot.isBooked && (
                  <Text style={styles.bookedLabel}>Booked</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
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
          (submitting ||
            selectedServiceIds.length === 0 ||
            !selectedTimeSlot) &&
            styles.submitButtonDisabled,
        ]}
        onPress={handleSubmitBooking}
        disabled={
          submitting || selectedServiceIds.length === 0 || !selectedTimeSlot
        }
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
  timeSlotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  timeSlot: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.backgroundDark,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.backgroundDark,
    minWidth: 80,
    alignItems: "center",
  },
  timeSlotSelected: {
    backgroundColor: "#F0EDFF",
    borderColor: theme.colors.primary,
  },
  timeSlotText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "600",
  },
  timeSlotTextSelected: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  timeSlotBooked: {
    backgroundColor: "#FFE5E5",
    borderColor: "#FFCCCB",
    opacity: 0.6,
  },
  timeSlotTextBooked: {
    color: "#999",
    textDecorationLine: "line-through",
  },
  bookedLabel: {
    fontSize: 10,
    color: "#F44336",
    marginTop: 2,
  },
  noSlotsContainer: {
    alignItems: "center",
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.backgroundDark,
    borderRadius: theme.borderRadius.md,
  },
  noSlotsIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  noSlotsText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
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
  errorIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  errorTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  errorButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
  },
  errorButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.md,
    fontWeight: "600",
  },
});
