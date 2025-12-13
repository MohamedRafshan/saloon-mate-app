import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { HomeScreen } from "../screens/customer/HomeScreen";
import { SalonProfileScreen } from "../screens/customer/SalonProfileScreen";

export type HomeStackParamList = {
  Home: undefined;
  SalonProfile: { salonId: string };
};

const Stack = createStackNavigator<HomeStackParamList>();

export function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="SalonProfile"
        component={SalonProfileScreen}
        options={{ headerShown: true, title: "Salon" }}
      />
    </Stack.Navigator>
  );
}
