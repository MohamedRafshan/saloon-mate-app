import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Text } from "react-native";
import { AnalyticsScreen } from "../screens/shop/AnalyticsScreen";
import { BusinessHoursScreen } from "../screens/shop/BusinessHoursScreen";
import { BusinessInfoScreen } from "../screens/shop/BusinessInfoScreen";
import { ContactSupportScreen } from "../screens/shop/ContactSupportScreen";
import { EarningsScreen } from "../screens/shop/EarningsScreen";
import { GalleryScreen } from "../screens/shop/GalleryScreen";
import { HelpScreen } from "../screens/shop/HelpScreen";
import { LocationScreen } from "../screens/shop/LocationScreen";
import { PaymentSettingsScreen } from "../screens/shop/PaymentSettingsScreen";
import { ReviewsScreen } from "../screens/shop/ReviewsScreen";
import { SettingsScreen } from "../screens/shop/SettingsScreen";
import { ShopAppointmentsScreen } from "../screens/shop/ShopAppointmentsScreen";
import { ShopDashboardScreen } from "../screens/shop/ShopDashboardScreen";
import { ShopProfileScreen } from "../screens/shop/ShopProfileScreen";
import { ShopServicesScreen } from "../screens/shop/ShopServicesScreen";
import { StaffManagementScreen } from "../screens/shop/StaffManagementScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const ProfileStackNav = createStackNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ShopDashboardMain" component={ShopDashboardScreen} />
      <Stack.Screen name="Analytics" component={AnalyticsScreen} />
      <Stack.Screen name="BusinessHours" component={BusinessHoursScreen} />
      <Stack.Screen name="StaffManagement" component={StaffManagementScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <ProfileStackNav.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStackNav.Screen
        name="ShopProfileMain"
        component={ShopProfileScreen}
      />
      <ProfileStackNav.Screen
        name="BusinessInfo"
        component={BusinessInfoScreen}
      />
      <ProfileStackNav.Screen
        name="BusinessHours"
        component={BusinessHoursScreen}
      />
      <ProfileStackNav.Screen
        name="StaffManagement"
        component={StaffManagementScreen}
      />
      <ProfileStackNav.Screen name="Location" component={LocationScreen} />
      <ProfileStackNav.Screen name="Gallery" component={GalleryScreen} />
      <ProfileStackNav.Screen name="Reviews" component={ReviewsScreen} />
      <ProfileStackNav.Screen name="Earnings" component={EarningsScreen} />
      <ProfileStackNav.Screen
        name="PaymentSettings"
        component={PaymentSettingsScreen}
      />
      <ProfileStackNav.Screen name="Help" component={HelpScreen} />
      <ProfileStackNav.Screen
        name="ContactSupport"
        component={ContactSupportScreen}
      />
      <ProfileStackNav.Screen name="Settings" component={SettingsScreen} />
    </ProfileStackNav.Navigator>
  );
}

export function ShopTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarShowLabel: false }}
    >
      <Tab.Screen
        name="ShopDashboard"
        component={DashboardStack}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 24 }}>🏠</Text> }}
      />
      <Tab.Screen
        name="ShopAppointments"
        component={ShopAppointmentsScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 24 }}>📅</Text> }}
      />
      <Tab.Screen
        name="ShopServices"
        component={ShopServicesScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 24 }}>✂️</Text> }}
      />
      <Tab.Screen
        name="ShopProfile"
        component={ProfileStack}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 24 }}>👤</Text> }}
      />
    </Tab.Navigator>
  );
}
