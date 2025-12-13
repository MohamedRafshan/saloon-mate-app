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
import { mockAPI } from "../../api/mock";
import reviewsData from "../../api/mock/reviews.json";
import staffData from "../../api/mock/staff.json";
import { Salon } from "../../types/Salon";
import { Service } from "../../types/Service";

const { width } = Dimensions.get("window");

type TabType = "Photos" | "Services" | "Team" | "Reviews" | "About";

export const SalonProfileScreen = ({ route, navigation }: any) => {
  const { salonId } = route?.params || {};
  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("Services");
  const [serviceCategory, setServiceCategory] = useState("Featured");

  useEffect(() => {
    if (salonId) {
      loadSalonData();
    }
  }, [salonId]);

  const loadSalonData = async () => {
    try {
      const [salonData, servicesData] = await Promise.all([
        mockAPI.getSalonById(salonId),
        mockAPI.getServicesBySalonId(salonId),
      ]);
      setSalon(salonData);
      setServices(servicesData);
    } catch (error) {
      console.error("Failed to load salon:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  if (!salon) return null;

  const staff = staffData.filter((s: any) => s.salonId === salonId);
  const reviews = reviewsData.filter((r: any) => r.salonId === salonId);
  const serviceCategories = [
    "Featured",
    "Haircut",
    "Wash & Styling",
    "Hair Care",
  ];
  const filteredServices = services.filter(
    (s: any) => s.category === serviceCategory
  );

  const renderHeader = () => (
    <View style={styles.headerImageContainer}>
      <Image source={{ uri: salon.image }} style={styles.headerImage} />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconText}>⤴</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconText}>♡</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.imageCounter}>
        <Text style={styles.imageCounterText}>1/8</Text>
      </View>
    </View>
  );

  const renderSalonInfo = () => (
    <View style={styles.salonInfo}>
      <Text style={styles.salonName}>{salon.name}</Text>
      <View style={styles.ratingRow}>
        <Text style={styles.rating}>{salon.rating.toFixed(1)}</Text>
        <Text style={styles.starIcons}>⭐⭐⭐⭐⭐</Text>
        <Text style={styles.reviewCount}>({salon.reviewCount})</Text>
      </View>
      <Text style={styles.location}>Mont Kiara, Kuala Lumpur</Text>
      <Text style={styles.openingStatus}>
        Closed - opens on Saturday at 10:00
      </Text>
      <View style={styles.featuredBadge}>
        <Text style={styles.featuredText}>Featured</Text>
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      {(["Photos", "Services", "Team", "Reviews", "About"] as TabType[]).map(
        (tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.tab}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        )
      )}
    </View>
  );

  const renderServicesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Services</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        {serviceCategories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              serviceCategory === cat && styles.categoryButtonActive,
            ]}
            onPress={() => setServiceCategory(cat)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                serviceCategory === cat && styles.categoryButtonTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filteredServices.map((service: any) => (
        <View key={service.id} style={styles.serviceItem}>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceDuration}>{service.duration}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.servicePrice}>
                from {service.currency} {service.price}
              </Text>
              {service.discount && (
                <Text style={styles.discountBadge}>{service.discount}</Text>
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.seeAllButton}>
        <Text style={styles.seeAllText}>See all</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTeamTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.teamHeader}>
        <Text style={styles.sectionTitle}>Team</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllLink}>See all</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {staff.map((member: any) => (
          <View key={member.id} style={styles.teamMember}>
            <Image source={{ uri: member.image }} style={styles.teamImage} />
            <View style={styles.teamRating}>
              <Text style={styles.teamRatingText}>
                {member.rating.toFixed(1)}
              </Text>
              <Text style={styles.starIcon}>⭐</Text>
            </View>
            <Text style={styles.teamName}>{member.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderReviewsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Reviews</Text>
      <View style={styles.overallRating}>
        <Text style={styles.starIconsLarge}>⭐⭐⭐⭐⭐</Text>
        <View style={styles.ratingTextRow}>
          <Text style={styles.ratingLarge}>{salon.rating.toFixed(1)}</Text>
          <Text style={styles.reviewCountLarge}>({salon.reviewCount})</Text>
        </View>
      </View>

      {reviews.map((review: any) => (
        <View key={review.id} style={styles.reviewItem}>
          <View style={styles.reviewHeader}>
            <View style={styles.reviewAvatar}>
              <Text style={styles.reviewInitials}>{review.userInitials}</Text>
            </View>
            <View style={styles.reviewInfo}>
              <Text style={styles.reviewerName}>{review.userName}</Text>
              <Text style={styles.reviewDate}>
                {new Date(review.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          </View>
          <Text style={styles.reviewStars}>⭐⭐⭐⭐⭐</Text>
          <Text style={styles.reviewText} numberOfLines={3}>
            {review.comment}
          </Text>
          <TouchableOpacity>
            <Text style={styles.readMore}>Read more</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderAboutTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Opening times</Text>
      {[
        { day: "Monday", time: "Closed", closed: true },
        { day: "Tuesday", time: "11:00 - 19:00", closed: false },
        { day: "Wednesday", time: "11:00 - 18:00", closed: false },
        { day: "Thursday", time: "11:00 - 19:00", closed: false },
        { day: "Friday", time: "11:00 - 19:00", closed: false },
        { day: "Saturday", time: "10:00 - 18:00", closed: false },
        { day: "Sunday", time: "10:00 - 18:00", closed: false },
      ].map((item) => (
        <View key={item.day} style={styles.openingTimeRow}>
          <View style={styles.dayRow}>
            <View
              style={[
                styles.dayIndicator,
                item.closed && styles.dayIndicatorClosed,
              ]}
            />
            <Text
              style={[
                styles.dayText,
                item.day === "Friday" && styles.dayTextBold,
              ]}
            >
              {item.day}
            </Text>
          </View>
          <Text style={[styles.timeText, item.closed && styles.closedText]}>
            {item.time}
          </Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Additional information</Text>
      <View style={styles.infoRow}>
        <Text style={styles.checkIcon}>✓</Text>
        <Text style={styles.infoText}>Instant confirmation</Text>
      </View>

      <View style={styles.mapContainer}>
        <Image
          source={{
            uri: "https://via.placeholder.com/600x200/E0E0E0/999999?text=Map",
          }}
          style={styles.mapImage}
        />
        <View style={styles.mapPin}>
          <Text style={styles.mapPinText}>{salon.rating.toFixed(1)}</Text>
        </View>
      </View>

      <Text style={styles.addressText}>{salon.address}</Text>
      <TouchableOpacity>
        <Text style={styles.directionsLink}>Get directions</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Venues nearby</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.nearbyVenue}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
            }}
            style={styles.nearbyImage}
          />
          <Text style={styles.nearbyName}>Zara Aesthetic</Text>
          <View style={styles.nearbyRating}>
            <Text style={styles.starIcon}>⭐</Text>
            <Text style={styles.nearbyRatingText}>5.0 (6)</Text>
          </View>
          <Text style={styles.nearbyLocation}>Mont Kiara, Kuala Lumpur</Text>
          <Text style={styles.nearbyCategory}>Medspa</Text>
        </View>
        <View style={styles.nearbyVenue}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=400",
            }}
            style={styles.nearbyImage}
          />
          <Text style={styles.nearbyName}>GAGA RETREAT</Text>
          <Text style={styles.nearbyNoRating}>No rating yet</Text>
          <Text style={styles.nearbyLocation}>Mont Kiara, Kuala Lumpur</Text>
          <Text style={styles.nearbyCategory}>Nails</Text>
        </View>
      </ScrollView>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "Services":
        return renderServicesTab();
      case "Team":
        return renderTeamTab();
      case "Reviews":
        return renderReviewsTab();
      case "About":
        return renderAboutTab();
      default:
        return renderServicesTab();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderHeader()}
        {renderSalonInfo()}
        {renderTabs()}
        {renderTabContent()}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {services.length} services available
        </Text>
        <TouchableOpacity
          style={styles.bookNowButton}
          onPress={() =>
            navigation.navigate("BookingForm", {
              salonId,
              salonName: salon.name,
            })
          }
        >
          <Text style={styles.bookNowText}>Book now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  headerImageContainer: {
    position: "relative",
    width: "100%",
    height: 300,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 24,
    color: "#000",
  },
  headerIcons: {
    position: "absolute",
    top: 40,
    right: 16,
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 20,
  },
  imageCounter: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  imageCounterText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  salonInfo: {
    padding: 20,
  },
  salonName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  rating: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginRight: 8,
  },
  starIcons: {
    fontSize: 14,
    marginRight: 6,
  },
  reviewCount: {
    fontSize: 16,
    color: "#6C5CE7",
  },
  location: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  openingStatus: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  featuredBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#F0EDFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  featuredText: {
    color: "#6C5CE7",
    fontSize: 14,
    fontWeight: "600",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingHorizontal: 20,
  },
  tab: {
    marginRight: 24,
    paddingBottom: 12,
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  tabTextActive: {
    color: "#000",
    fontWeight: "600",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#000",
  },
  tabContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
    marginTop: 8,
  },
  categoryScroll: {
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: "#000",
  },
  categoryButtonText: {
    fontSize: 14,
    color: "#666",
  },
  categoryButtonTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  serviceDuration: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginRight: 8,
  },
  discountBadge: {
    fontSize: 12,
    color: "#00A86B",
    fontWeight: "600",
  },
  bookButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#000",
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  seeAllButton: {
    marginTop: 16,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
  },
  seeAllText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  teamHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAllLink: {
    fontSize: 16,
    color: "#6C5CE7",
    fontWeight: "600",
  },
  teamMember: {
    marginRight: 16,
    alignItems: "center",
  },
  teamImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
  },
  teamRating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: -20,
    marginBottom: 8,
  },
  teamRatingText: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
  },
  starIcon: {
    fontSize: 14,
  },
  teamName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  overallRating: {
    alignItems: "center",
    marginBottom: 24,
  },
  starIconsLarge: {
    fontSize: 32,
    marginBottom: 8,
  },
  ratingTextRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  ratingLarge: {
    fontSize: 32,
    fontWeight: "700",
    color: "#000",
    marginRight: 8,
  },
  reviewCountLarge: {
    fontSize: 18,
    color: "#6C5CE7",
  },
  reviewItem: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  reviewHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E8E4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  reviewInitials: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6C5CE7",
  },
  reviewInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 14,
    color: "#666",
  },
  reviewStars: {
    fontSize: 16,
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 8,
  },
  readMore: {
    fontSize: 14,
    color: "#6C5CE7",
    fontWeight: "600",
  },
  openingTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dayIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#00C853",
    marginRight: 12,
  },
  dayIndicatorClosed: {
    backgroundColor: "#E0E0E0",
  },
  dayText: {
    fontSize: 16,
    color: "#333",
  },
  dayTextBold: {
    fontWeight: "600",
    color: "#000",
  },
  timeText: {
    fontSize: 16,
    color: "#000",
  },
  closedText: {
    color: "#999",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkIcon: {
    fontSize: 18,
    marginRight: 8,
    color: "#666",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
  },
  mapContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  mapPin: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -30 }, { translateY: -40 }],
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  mapPinText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  addressText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 8,
  },
  directionsLink: {
    fontSize: 16,
    color: "#6C5CE7",
    fontWeight: "600",
    marginBottom: 24,
  },
  nearbyVenue: {
    width: 200,
    marginRight: 16,
  },
  nearbyImage: {
    width: 200,
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  nearbyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  nearbyRating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  nearbyRatingText: {
    fontSize: 14,
    color: "#000",
  },
  nearbyNoRating: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  nearbyLocation: {
    fontSize: 13,
    color: "#666",
    marginBottom: 2,
  },
  nearbyCategory: {
    fontSize: 13,
    color: "#666",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#fff",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
  },
  bookNowButton: {
    backgroundColor: "#000",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
  },
  bookNowText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
