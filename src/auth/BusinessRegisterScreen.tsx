import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthStackParamList } from "../navigation/AuthStack";

type BusinessRegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "BusinessRegister"
>;

export const BusinessRegisterScreen = () => {
  const navigation = useNavigation<BusinessRegisterScreenNavigationProp>();

  const canGoBack = useNavigationState((state) => state.index > 0);

  const handleBack = () => {
    if (canGoBack) {
      navigation.goBack();
    } else {
      // Navigate to customer home when no screen to go back to
      (navigation as any).navigate("CustomerTabNavigator", {
        screen: "HomeTab",
      });
    }
  };

  // Business Information
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTown, setSelectedTown] = useState("");
  const [addressDetails, setAddressDetails] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Location
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // Owner Information
  const [ownerName, setOwnerName] = useState("");

  // Security
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Amenities (checkboxes)
  const [hasWiFi, setHasWiFi] = useState(false);
  const [hasParking, setHasParking] = useState(false);
  const [hasCoffeeBar, setHasCoffeeBar] = useState(false);
  const [hasMusic, setHasMusic] = useState(false);

  const [loading, setLoading] = useState(false);

  const categoryOptions = [
    "Hair Salon",
    "Barber",
    "Beauty Salon",
    "Spa",
    "Nail Salon",
    "Massage",
  ];

  // Sri Lankan Districts and Towns
  const sriLankaData: { [key: string]: string[] } = {
    Colombo: [
      "Colombo 1",
      "Colombo 2",
      "Colombo 3",
      "Colombo 4",
      "Colombo 5",
      "Colombo 6",
      "Colombo 7",
      "Colombo 8",
      "Dehiwala",
      "Mount Lavinia",
      "Moratuwa",
      "Nugegoda",
      "Kotte",
      "Maharagama",
      "Piliyandala",
    ],
    Gampaha: [
      "Gampaha",
      "Negombo",
      "Katunayake",
      "Ja-Ela",
      "Wattala",
      "Kelaniya",
      "Minuwangoda",
      "Kadawatha",
      "Ragama",
      "Veyangoda",
      "Divulapitiya",
      "Nittambuwa",
    ],
    Kalutara: [
      "Kalutara",
      "Panadura",
      "Horana",
      "Beruwala",
      "Aluthgama",
      "Matugama",
      "Wadduwa",
      "Bandaragama",
    ],
    Kandy: [
      "Kandy",
      "Peradeniya",
      "Gampola",
      "Nawalapitiya",
      "Katugastota",
      "Akurana",
      "Kadugannawa",
      "Wattegama",
    ],
    Matale: [
      "Matale",
      "Dambulla",
      "Sigiriya",
      "Galewela",
      "Ukuwela",
      "Rattota",
    ],
    "Nuwara Eliya": [
      "Nuwara Eliya",
      "Hatton",
      "Nanuoya",
      "Talawakelle",
      "Bandarawela",
      "Haputale",
    ],
    Galle: [
      "Galle",
      "Hikkaduwa",
      "Ambalangoda",
      "Unawatuna",
      "Bentota",
      "Elpitiya",
      "Baddegama",
    ],
    Matara: [
      "Matara",
      "Weligama",
      "Mirissa",
      "Dikwella",
      "Deniyaya",
      "Akuressa",
    ],
    Hambantota: [
      "Hambantota",
      "Tangalle",
      "Tissamaharama",
      "Ambalantota",
      "Beliatta",
    ],
    Jaffna: [
      "Jaffna",
      "Nallur",
      "Chavakachcheri",
      "Point Pedro",
      "Karainagar",
      "Kayts",
    ],
    Kilinochchi: ["Kilinochchi", "Pallai", "Paranthan"],
    Mannar: ["Mannar", "Nanattan", "Madhu"],
    Vavuniya: ["Vavuniya", "Nedunkeni", "Omanthai"],
    Mullaitivu: ["Mullaitivu", "Oddusuddan", "Puthukkudiyiruppu"],
    Batticaloa: [
      "Batticaloa",
      "Kattankudy",
      "Eravur",
      "Kaluwanchikudy",
      "Valachchenai",
    ],
    Ampara: [
      "Ampara",
      "Kalmunai",
      "Sainthamaruthu",
      "Akkaraipattu",
      "Pottuvil",
    ],
    Trincomalee: ["Trincomalee", "Kinniya", "Mutur", "Kuchchaveli"],
    Kurunegala: [
      "Kurunegala",
      "Kuliyapitiya",
      "Narammala",
      "Wariyapola",
      "Pannala",
      "Melsiripura",
      "Polgahawela",
    ],
    Puttalam: ["Puttalam", "Chilaw", "Wennappuwa", "Anamaduwa", "Nattandiya"],
    Anuradhapura: [
      "Anuradhapura",
      "Medawachchiya",
      "Kekirawa",
      "Tambuttegama",
      "Eppawala",
    ],
    Polonnaruwa: ["Polonnaruwa", "Kaduruwela", "Medirigiriya", "Hingurakgoda"],
    Badulla: [
      "Badulla",
      "Bandarawela",
      "Haputale",
      "Welimada",
      "Mahiyanganaya",
      "Hali Ela",
    ],
    Moneragala: ["Moneragala", "Bibile", "Wellawaya", "Buttala"],
    Ratnapura: [
      "Ratnapura",
      "Embilipitiya",
      "Balangoda",
      "Pelmadulla",
      "Eheliyagoda",
      "Kuruwita",
    ],
    Kegalle: [
      "Kegalle",
      "Mawanella",
      "Warakapola",
      "Rambukkana",
      "Ruwanwella",
      "Dehiowita",
    ],
  };

  const districts = Object.keys(sriLankaData);
  const availableTowns = selectedDistrict ? sriLankaData[selectedDistrict] : [];

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    setSelectedTown(""); // Reset town when district changes
  };

  const toggleCategory = (category: string) => {
    if (categories.includes(category)) {
      setCategories(categories.filter((c) => c !== category));
    } else {
      setCategories([...categories, category]);
    }
  };

  const handleRegister = async () => {
    // Validate required fields
    if (
      !businessName ||
      !description ||
      categories.length === 0 ||
      !ownerName ||
      !email ||
      !phone ||
      !selectedDistrict ||
      !selectedTown ||
      !addressDetails ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert(
        "Error",
        "Please fill in all required fields and select at least one category"
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    // Validate location if provided
    if (latitude && isNaN(parseFloat(latitude))) {
      Alert.alert("Error", "Please enter a valid latitude");
      return;
    }
    if (longitude && isNaN(parseFloat(longitude))) {
      Alert.alert("Error", "Please enter a valid longitude");
      return;
    }

    setLoading(true);
    try {
      const { authService } = await import("../services/authService");

      // Prepare amenities array
      const amenities = [];
      if (hasWiFi) amenities.push("WiFi");
      if (hasParking) amenities.push("Parking");
      if (hasCoffeeBar) amenities.push("Coffee Bar");
      if (hasMusic) amenities.push("Music");

      await authService.register(
        {
          name: ownerName,
          email: email,
          phone: phone,
          role: "business",
          businessName: businessName,
          description: description,
          category: categories.join(", "),
          categories: categories,
          district: selectedDistrict,
          city: selectedTown,
          address: addressDetails,
          fullAddress: `${addressDetails}, ${selectedTown}, ${selectedDistrict}`,
          latitude: latitude ? parseFloat(latitude) : undefined,
          longitude: longitude ? parseFloat(longitude) : undefined,
          amenities: amenities,
        },
        password
      );
      Alert.alert(
        "Registration Successful",
        "Your business account has been created. Please log in.",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }]
      );
      navigation.navigate({ name: "SalonProfile" } as never);
      // The navigation will be handled by the auth state listener
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUseMyLocation = async () => {
    try {
      const { getCurrentCoordinates } = await import(
        "../services/locationService"
      );
      const coords = await getCurrentCoordinates();
      if (!coords) {
        Alert.alert(
          "Location Permission",
          "Please allow location access to auto-fill coordinates."
        );
        return;
      }
      setLatitude(String(coords.latitude));
      setLongitude(String(coords.longitude));
      Alert.alert("Location Set", "Coordinates filled from your device");
    } catch (e) {
      Alert.alert("Error", "Failed to get current location.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      enabled={Platform.OS === "ios"}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={28} color="#000000" />
        </TouchableOpacity>

        <View style={styles.form}>
          <View style={styles.header}>
            <Text style={styles.badge}>🏢</Text>
            <Text style={styles.title}>Register Your Business</Text>
          </View>

          <Text style={styles.subtitle}>
            Join our platform to connect with customers and grow your business
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.sectionTitle}>Business Information</Text>

            <TextInput
              style={styles.input}
              placeholder="Business Name *"
              value={businessName}
              onChangeText={setBusinessName}
              autoCapitalize="words"
              placeholderTextColor="#999"
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Business Description *"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              placeholderTextColor="#999"
            />

            <Text style={styles.sectionTitle}>Category *</Text>
            <Text style={styles.helperText}>
              Select all that apply to your business
            </Text>
            <View style={styles.checkboxContainer}>
              {categoryOptions.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={styles.checkbox}
                  onPress={() => toggleCategory(cat)}
                >
                  <Ionicons
                    name={
                      categories.includes(cat) ? "checkbox" : "square-outline"
                    }
                    size={24}
                    color={categories.includes(cat) ? "#6C5CE7" : "#999"}
                  />
                  <Text style={styles.checkboxLabel}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Location *</Text>

            <Text style={styles.label}>District *</Text>
            <View style={styles.pickerContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScroll}
              >
                {districts.map((district) => (
                  <TouchableOpacity
                    key={district}
                    style={[
                      styles.districtButton,
                      selectedDistrict === district &&
                        styles.districtButtonActive,
                    ]}
                    onPress={() => handleDistrictChange(district)}
                  >
                    <Text
                      style={[
                        styles.districtButtonText,
                        selectedDistrict === district &&
                          styles.districtButtonTextActive,
                      ]}
                    >
                      {district}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {selectedDistrict && (
              <>
                <Text style={styles.label}>Town/City *</Text>
                <View style={styles.pickerContainer}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.horizontalScroll}
                  >
                    {availableTowns.map((town) => (
                      <TouchableOpacity
                        key={town}
                        style={[
                          styles.districtButton,
                          selectedTown === town && styles.districtButtonActive,
                        ]}
                        onPress={() => setSelectedTown(town)}
                      >
                        <Text
                          style={[
                            styles.districtButtonText,
                            selectedTown === town &&
                              styles.districtButtonTextActive,
                          ]}
                        >
                          {town}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </>
            )}

            <TextInput
              style={styles.input}
              placeholder="Address Details (Street, Building No, etc.) *"
              value={addressDetails}
              onChangeText={setAddressDetails}
              autoCapitalize="words"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Business Phone *"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Business Email *"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />

            <Text style={styles.sectionTitle}>Location (Optional)</Text>
            <Text style={styles.helperText}>
              Provide coordinates to help customers find your business
            </Text>

            <TouchableOpacity
              style={styles.locationButton}
              onPress={handleUseMyLocation}
            >
              <Text style={styles.locationButtonText}>
                Use My Current Location
              </Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Latitude (e.g., 6.9271)"
              value={latitude}
              onChangeText={setLatitude}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Longitude (e.g., 79.8612)"
              value={longitude}
              onChangeText={setLongitude}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />

            <Text style={styles.sectionTitle}>Amenities</Text>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setHasWiFi(!hasWiFi)}
              >
                <Ionicons
                  name={hasWiFi ? "checkbox" : "square-outline"}
                  size={24}
                  color={hasWiFi ? "#6C5CE7" : "#999"}
                />
                <Text style={styles.checkboxLabel}>WiFi</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setHasParking(!hasParking)}
              >
                <Ionicons
                  name={hasParking ? "checkbox" : "square-outline"}
                  size={24}
                  color={hasParking ? "#6C5CE7" : "#999"}
                />
                <Text style={styles.checkboxLabel}>Parking</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setHasCoffeeBar(!hasCoffeeBar)}
              >
                <Ionicons
                  name={hasCoffeeBar ? "checkbox" : "square-outline"}
                  size={24}
                  color={hasCoffeeBar ? "#6C5CE7" : "#999"}
                />
                <Text style={styles.checkboxLabel}>Coffee Bar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setHasMusic(!hasMusic)}
              >
                <Ionicons
                  name={hasMusic ? "checkbox" : "square-outline"}
                  size={24}
                  color={hasMusic ? "#6C5CE7" : "#999"}
                />
                <Text style={styles.checkboxLabel}>Music</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Owner Information</Text>

            <TextInput
              style={styles.input}
              placeholder="Owner Name *"
              value={ownerName}
              onChangeText={setOwnerName}
              autoCapitalize="words"
              placeholderTextColor="#999"
            />

            <Text style={styles.sectionTitle}>Security</Text>

            <TextInput
              style={styles.input}
              placeholder="Password *"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm Password *"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? "Creating Account..." : "Create Business Account"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.linkContainer}>
            <Text style={styles.linkQuestion}>
              Already have a business account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.linkText}>Log in as business</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.termsText}>
            By creating a business account, you agree to our Business Terms of
            Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 24,
    zIndex: 10,
  },
  form: {
    marginTop: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  badge: {
    fontSize: 32,
    marginRight: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000000",
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    lineHeight: 24,
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginTop: 16,
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  helperText: {
    fontSize: 13,
    color: "#999",
    marginBottom: 12,
    marginTop: -8,
  },
  checkboxContainer: {
    marginBottom: 8,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#000",
    marginLeft: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
    marginTop: 4,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  horizontalScroll: {
    flexGrow: 0,
  },
  districtButton: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  districtButtonActive: {
    backgroundColor: "#6C5CE7",
    borderColor: "#6C5CE7",
  },
  districtButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  districtButtonTextActive: {
    color: "#FFFFFF",
  },
  registerButton: {
    backgroundColor: "#6C5CE7",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 24,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  linkContainer: {
    marginBottom: 16,
    marginTop: 16,
  },
  locationButton: {
    backgroundColor: "#F0EDFF",
    borderColor: "#6C5CE7",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  locationButtonText: {
    color: "#6C5CE7",
    fontWeight: "600",
  },
  linkQuestion: {
    fontSize: 15,
    color: "#000000",
    marginBottom: 4,
  },
  linkText: {
    fontSize: 15,
    color: "#6C5CE7",
    fontWeight: "500",
  },
  termsText: {
    fontSize: 13,
    color: "#999999",
    lineHeight: 20,
    textAlign: "center",
    marginTop: 24,
  },
});
