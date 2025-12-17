import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { salonService } from "../../api/salonService";
import { HomeStackParamList } from "../../navigation/HomeStack";
import { getCurrentCoordinates } from "../../services/locationService";
import { theme } from "../../theme";
import { Salon } from "../../types/Salon";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.65;

interface CategoryItem {
  id: string;
  name: string;
  image: string;
}

const categories: CategoryItem[] = [
  {
    id: "1",
    name: "Hair & styling",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400",
  },
  {
    id: "2",
    name: "Nails",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400",
  },
  {
    id: "3",
    name: "Eyebrows & eyelashes",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400",
  },
  {
    id: "4",
    name: "Massage",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400",
  },
  {
    id: "5",
    name: "Barbering",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400",
  },
  {
    id: "6",
    name: "Hair removal",
    image: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400",
  },
];

export const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const [salons, setSalons] = useState<Salon[]>([]);
  const [nearbySalons, setNearbySalons] = useState<
    (Salon & { distanceKm: number })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [loadingNearby, setLoadingNearby] = useState(true);

  useEffect(() => {
    loadSalons();
    loadNearbySalons();
  }, []);

  const loadSalons = async () => {
    try {
      const data = await salonService.getAllSalons();
      setSalons(data);
    } catch (error) {
      console.error("Failed to load salons:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadNearbySalons = async () => {
    try {
      const coords = await getCurrentCoordinates();
      if (coords) {
        const nearby = await salonService.getNearbySorted(
          coords.latitude,
          coords.longitude,
          25
        );
        // Filter to salons within 5km
        const within5km = nearby.filter((s) => s.distanceKm <= 5);
        setNearbySalons(within5km);
      }
    } catch (error) {
      console.warn("Failed to load nearby salons:", error);
    } finally {
      setLoadingNearby(false);
    }
  };

  const renderSalonCard = (salon: Salon) => (
    <TouchableOpacity
      key={salon.id}
      style={styles.salonCard}
      onPress={() => {
        console.log("clicked salon:", salon.id);
        navigation.navigate("SalonProfile", { salonId: salon.id });
      }}
      activeOpacity={0.9}
    >
      <Image source={{ uri: salon.image }} style={styles.salonImage} />
      <View style={styles.salonInfo}>
        <Text style={styles.salonName} numberOfLines={1}>
          {salon.name}
        </Text>
        <View style={styles.ratingRow}>
          <Text style={styles.starIcon}>⭐</Text>
          <Text style={styles.rating}>{salon.rating.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>({salon.reviewCount})</Text>
        </View>
        <Text style={styles.address} numberOfLines={1}>
          {salon.address}
        </Text>
        <Text style={styles.category}>{salon.category || "Salon"}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleCategoryPress = (category: CategoryItem) => {
    navigation.navigate("SearchTab" as any, {
      screen: "Search",
      params: { category: category.name },
    });
  };

  const renderCategoryCard = (category: CategoryItem) => (
    <TouchableOpacity
      key={category.id}
      style={styles.categoryCard}
      activeOpacity={0.8}
      onPress={() => handleCategoryPress(category)}
    >
      <Image source={{ uri: category.image }} style={styles.categoryImage} />
      <View style={styles.categoryOverlay}>
        <Text style={styles.categoryName}>{category.name}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const recommended = salons.slice(0, 2);
  const trending = salons.slice(4, 6);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>For you</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended</Text>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {recommended.map(renderSalonCard)}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nearby Salons</Text>
          {loadingNearby ? (
            <View style={styles.nearbySalonsLoading}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          ) : nearbySalons.length === 0 ? (
            <View style={styles.emptyNearby}>
              <Text style={styles.emptyNearbyText}>📍</Text>
              <Text style={styles.emptyNearbyTitle}>
                No nearby salons available
              </Text>
              <Text style={styles.emptyNearbySubtitle}>
                Try exploring other categories or search for specific salons
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {nearbySalons.map((salon) => (
                <View key={salon.id}>
                  {renderSalonCard(salon)}
                  <Text style={styles.distanceBadge}>
                    {salon.distanceKm.toFixed(1)} km away
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending</Text>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {trending.map(renderSalonCard)}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map(renderCategoryCard)}
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#000",
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  searchIcon: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  horizontalScroll: {
    paddingHorizontal: 16,
  },
  salonCard: {
    width: CARD_WIDTH,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  salonImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#F0F0F0",
  },
  salonInfo: {
    padding: 12,
  },
  salonName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
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
  address: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
    color: "#666",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
  },
  categoryCard: {
    width: (width - 48) / 2,
    height: 120,
    margin: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    paddingLeft: 16,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  bottomSpacer: {
    height: 80,
  },
  nearbySalonsLoading: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyNearby: {
    paddingVertical: 40,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  emptyNearbyText: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyNearbyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyNearbySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  distanceBadge: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    marginLeft: 16,
    fontWeight: "500",
  },
});
