import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Text } from "react-native";
import { MyBookingsScreen } from "../customer/screen/MyBookingsScreen";
import { SearchScreen } from "../customer/screen/SearchScreen";
import { UserProfileScreen } from "../customer/screen/UserProfileScreen";
import { HomeStack } from "./HomeStack";

const Tab = createBottomTabNavigator();

export function CustomerTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarShowLabel: false }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 24 }}>🏠</Text> }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 24 }}>🔍</Text> }}
      />
      <Tab.Screen
        name="BookingsTab"
        component={MyBookingsScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 24 }}>📅</Text> }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={UserProfileScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 24 }}>👤</Text> }}
      />
    </Tab.Navigator>
  );
}
