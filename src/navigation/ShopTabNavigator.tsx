import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Text } from "react-native";
import { ShopAppointmentsScreen } from "../screens/shop/ShopAppointmentsScreen";
import { ShopDashboardScreen } from "../screens/shop/ShopDashboardScreen";
import { ShopProfileScreen } from "../screens/shop/ShopProfileScreen";
import { ShopServicesScreen } from "../screens/shop/ShopServicesScreen";

const Tab = createBottomTabNavigator();

export function ShopTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarShowLabel: false }}
    >
      <Tab.Screen
        name="ShopDashboard"
        component={ShopDashboardScreen}
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
