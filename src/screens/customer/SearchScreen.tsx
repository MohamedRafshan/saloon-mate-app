import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { mockAPI } from "../../api/mock";
import { HomeStackParamList } from "../../navigation/HomeStack";
import { Salon } from "../../types/Salon";

// Conditionally import MapView only on native platforms
// Note: react-native-maps requires a development build and won't work with Expo Go
let MapView: any = null;
let Marker: any = null;
let PROVIDER_GOOGLE: any = null;

// Disable maps in Expo Go for now
const MAPS_AVAILABLE = false; // Change to true when using development build

if (MAPS_AVAILABLE && Platform.OS !== "web") {
  try {
    const maps = require("react-native-maps");
    MapView = maps.default;
    Marker = maps.Marker;
    PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
  } catch (e) {
    console.log("Maps not available:", e);
  }
}

const { width, height } = Dimensions.get("window");

type SortOption = "best-match" | "top-rated" | "nearest";
type VenueType = "all" | "male" | "female";
type ViewMode = "list" | "map";

const isWeb = Platform.OS === "web";

export const SearchScreen = () => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const [salons, setSalons] = useState<Salon[]>([]);
  const [filteredSalons, setFilteredSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("All treatments");
  const [viewMode, setViewMode] = useState<ViewMode>("list"); // Always use list view for Expo Go

  // Filter states
  const [sortBy, setSortBy] = useState<SortOption>("best-match");
  const [venueType, setVenueType] = useState<VenueType>("all");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [showFilters, setShowFilters] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [showVenueTypeModal, setShowVenueTypeModal] = useState(false);

  // Map state
  const [mapRegion, setMapRegion] = useState({
    latitude: 6.9271,
    longitude: 79.8612,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  });

  useEffect(() => {
    loadSalons();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [salons, searchQuery, sortBy, venueType, maxPrice]);

  const loadSalons = async () => {
    try {
      const data = await mockAPI.getSalons();
      setSalons(data);
    } catch (error) {
      console.error("Failed to load salons:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...salons];

    // Search filter
    if (searchQuery.trim() && searchQuery !== "All treatments") {
      filtered = filtered.filter(
        (salon) =>
          salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          salon.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          salon.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Venue type filter
    if (venueType === "male") {
      filtered = filtered.filter(
        (s) => s.category === "Barber" || s.name.toLowerCase().includes("gents")
      );
    } else if (venueType === "female") {
      filtered = filtered.filter(
        (s) =>
          s.category === "Beauty Salon" ||
          s.category === "Hair Salon" ||
          s.name.toLowerCase().includes("beauty")
      );
    }

    // Sort
    if (sortBy === "top-rated") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "nearest") {
      // For now, just sort by city (in real app, would use GPS distance)
      filtered.sort((a, b) =>
        (a.city || a.address).localeCompare(b.city || b.address)
      );
    } else {
      // Best match - combine rating and review count
      filtered.sort(
        (a, b) =>
          b.rating * Math.log(b.reviewCount + 1) -
          a.rating * Math.log(a.reviewCount + 1)
      );
    }

    setFilteredSalons(filtered);
  };

  const clearFilters = () => {
    setSortBy("best-match");
    setVenueType("all");
    setMaxPrice(10000);
    setSearchQuery("All treatments");
  };

  const renderSalonCard = (salon: Salon) => (
    <TouchableOpacity
      key={salon.id}
      style={styles.salonCard}
      onPress={() => {
        navigation.navigate("SalonProfile", { salonId: salon.id });
      }}
      activeOpacity={0.8}
    >
      <Image source={{ uri: salon.image }} style={styles.salonImage} />
      <View style={styles.salonInfo}>
        <Text style={styles.salonName}>{salon.name}</Text>
        <Text style={styles.salonAddress}>{salon.address}</Text>

        <View style={styles.ratingRow}>
          <Text style={styles.starIcon}>⭐</Text>
          <Text style={styles.rating}>{salon.rating.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>({salon.reviewCount})</Text>
        </View>

        {salon.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{salon.category}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderMapView = () => {
    if (!MAPS_AVAILABLE || isWeb) {
      // Fallback - show message that map is not available
      return (
        <View style={styles.mapContainer}>
          <View style={styles.webMapPlaceholder}>
            <Text style={styles.webMapIcon}>🗺️</Text>
            <Text style={styles.webMapTitle}>Map View</Text>
            <Text style={styles.webMapText}>
              Map view requires a development build.
            </Text>
            <Text style={styles.webMapText}>
              Currently running with Expo Go. Please use the list view.
            </Text>
            <TouchableOpacity
              style={styles.webMapButton}
              onPress={() => setViewMode("list")}
            >
              <Text style={styles.webMapButtonText}>Switch to List View</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={mapRegion}
          onRegionChangeComplete={setMapRegion}
        >
          {filteredSalons
            .filter((salon) => salon.location)
            .map((salon) => (
              <Marker
                key={salon.id}
                coordinate={{
                  latitude: salon.location!.latitude,
                  longitude: salon.location!.longitude,
                }}
                onPress={() => {
                  navigation.navigate("SalonProfile", { salonId: salon.id });
                }}
              >
                <View style={styles.markerContainer}>
                  <View style={styles.marker}>
                    <Text style={styles.markerText}>
                      {salon.rating.toFixed(1)}
                    </Text>
                  </View>
                </View>
              </Marker>
            ))}
        </MapView>

        {/* Results counter on map */}
        <View style={styles.mapResultsBar}>
          <Text style={styles.mapResultsText}>
            {filteredSalons.length} results • Clear search
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search salons, services..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && searchQuery !== "All treatments" && (
            <TouchableOpacity onPress={() => setSearchQuery("All treatments")}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Location/View toggle bar */}
      <View style={styles.locationBar}>
        <View style={styles.locationInfo}>
          <Text style={styles.searchQueryText}>{searchQuery}</Text>
          <Text style={styles.locationText}>
            • {viewMode === "map" ? "Map area" : "Current location"}
          </Text>
        </View>
        {MAPS_AVAILABLE && !isWeb && (
          <TouchableOpacity
            style={styles.viewToggle}
            onPress={() => setViewMode(viewMode === "map" ? "list" : "map")}
          >
            <Text style={styles.viewToggleIcon}>
              {viewMode === "map" ? "📋" : "🗺️"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Buttons - Always visible */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={styles.filterChip}
          onPress={() => setShowSortModal(true)}
        >
          <Text style={styles.filterChipText}>
            {sortBy === "best-match"
              ? "Best match"
              : sortBy === "top-rated"
              ? "Top rated"
              : "Nearest"}
          </Text>
          <Text style={styles.chevron}>▼</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterChip}>
          <Text style={styles.filterChipText}>Price</Text>
          <Text style={styles.chevron}>▼</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterChip}>
          <Text style={styles.filterChipText}>Options</Text>
        </TouchableOpacity>
      </View>

      {/* Map or List View */}
      {viewMode === "map" ? (
        renderMapView()
      ) : (
        <>
          {/* Results Count */}
          <View style={styles.resultsBar}>
            <Text style={styles.resultsText}>
              {filteredSalons.length} venue
              {filteredSalons.length !== 1 ? "s" : ""} nearby
            </Text>
          </View>

          {/* Salons List */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {filteredSalons.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyTitle}>No salons found</Text>
                <Text style={styles.emptySubtitle}>
                  Try adjusting your filters or search terms
                </Text>
              </View>
            ) : (
              filteredSalons.map(renderSalonCard)
            )}
          </ScrollView>
        </>
      )}

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort by</Text>

            <TouchableOpacity
              style={[
                styles.modalOption,
                sortBy === "best-match" && styles.modalOptionSelected,
              ]}
              onPress={() => {
                setSortBy("best-match");
                setShowSortModal(false);
              }}
            >
              <Text style={styles.modalOptionIcon}>💜</Text>
              <Text style={styles.modalOptionText}>Best match</Text>
              {sortBy === "best-match" && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalOption,
                sortBy === "top-rated" && styles.modalOptionSelected,
              ]}
              onPress={() => {
                setSortBy("top-rated");
                setShowSortModal(false);
              }}
            >
              <Text style={styles.modalOptionIcon}>⭐</Text>
              <Text style={styles.modalOptionText}>Top rated</Text>
              {sortBy === "top-rated" && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalOption,
                sortBy === "nearest" && styles.modalOptionSelected,
              ]}
              onPress={() => {
                setSortBy("nearest");
                setShowSortModal(false);
              }}
            >
              <Text style={styles.modalOptionIcon}>📍</Text>
              <Text style={styles.modalOptionText}>Nearest</Text>
              {sortBy === "nearest" && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Venue Type Modal */}
      <Modal
        visible={showVenueTypeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowVenueTypeModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowVenueTypeModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Venue type</Text>

            <TouchableOpacity
              style={[
                styles.modalOption,
                venueType === "all" && styles.modalOptionSelected,
              ]}
              onPress={() => {
                setVenueType("all");
                setShowVenueTypeModal(false);
              }}
            >
              <Text style={styles.modalOptionText}>Everyone</Text>
              {venueType === "all" && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalOption,
                venueType === "male" && styles.modalOptionSelected,
              ]}
              onPress={() => {
                setVenueType("male");
                setShowVenueTypeModal(false);
              }}
            >
              <Text style={styles.modalOptionText}>Male only</Text>
              {venueType === "male" && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalOption,
                venueType === "female" && styles.modalOptionSelected,
              ]}
              onPress={() => {
                setVenueType("female");
                setShowVenueTypeModal(false);
              }}
            >
              <Text style={styles.modalOptionText}>Female only</Text>
              {venueType === "female" && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    marginRight: 12,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  clearIcon: {
    fontSize: 18,
    color: "#999",
    padding: 4,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  filterIcon: {
    fontSize: 20,
  },
  locationBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  searchQueryText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  locationText: {
    fontSize: 14,
    color: "#666",
  },
  viewToggle: {
    padding: 8,
  },
  viewToggleIcon: {
    fontSize: 20,
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F8F9FA",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
    color: "#333",
    marginRight: 4,
  },
  chevron: {
    fontSize: 10,
    color: "#666",
  },
  resultsBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  resultsText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  salonCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  salonImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#F0F0F0",
  },
  salonInfo: {
    padding: 16,
  },
  salonName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  salonAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  starIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: "#666",
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  // Map styles
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  markerContainer: {
    alignItems: "center",
  },
  marker: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#6C5CE7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  markerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  mapResultsBar: {
    position: "absolute",
    top: 16,
    alignSelf: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  mapResultsText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
  },
  modalOptionSelected: {
    backgroundColor: "#F0EDFF",
  },
  modalOptionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  modalOptionText: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  checkmark: {
    fontSize: 20,
    color: "#6C5CE7",
    fontWeight: "600",
  },
  // Web placeholder styles
  webMapPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#F8F9FA",
  },
  webMapIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  webMapTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  webMapText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  webMapButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: "#6C5CE7",
    borderRadius: 24,
  },
  webMapButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
