import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { BookingFormScreen } from "../screens/customer/BookingFormScreen";
import { SalonProfileScreen } from "../screens/customer/SalonProfileScreen";
import { SearchScreen } from "../screens/customer/SearchScreen";

export type SearchStackParamList = {
  Search: { category?: string } | undefined;
  SalonProfile: { salonId: string };
  BookingForm: { salonId: string; salonName: string };
};

const Stack = createStackNavigator<SearchStackParamList>();

export function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen
        name="SalonProfile"
        component={SalonProfileScreen}
        options={{ headerShown: true, title: "Salon" }}
      />
      <Stack.Screen
        name="BookingForm"
        component={BookingFormScreen}
        options={{ headerShown: true, title: "Book Appointment" }}
      />
    </Stack.Navigator>
  );
}
