import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Text } from "react-native";
import { AnalyticsScreen } from "../screens/shop/AnalyticsScreen";
import { BusinessHoursScreen } from "../screens/shop/BusinessHoursScreen";
import { ShopAppointmentsScreen } from "../screens/shop/ShopAppointmentsScreen";
import { ShopDashboardScreen } from "../screens/shop/ShopDashboardScreen";
import { ShopProfileScreen } from "../screens/shop/ShopProfileScreen";
import { ShopServicesScreen } from "../screens/shop/ShopServicesScreen";
import { StaffManagementScreen } from "../screens/shop/StaffManagementScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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
        component={ShopProfileScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 24 }}>👤</Text> }}
      />
    </Tab.Navigator>
  );
}
