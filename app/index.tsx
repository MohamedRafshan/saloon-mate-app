import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { AuthStack } from "../src/navigation/AuthStack";
import { CustomerTabNavigator } from "../src/navigation/CustomerTabNavigator";
import { ShopTabNavigator } from "../src/navigation/ShopTabNavigator";
import { authService } from "../src/services/authService";

const RootStack = createStackNavigator();

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = authService.subscribe((user) => {
      console.log("Auth state changed in index.tsx:", user?.email, user?.role);
      setUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  // No user logged in - show customer app with auth stack available
  if (!user) {
    return (
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen
          name="CustomerTabNavigator"
          component={CustomerTabNavigator}
        />
        <RootStack.Screen name="AuthStack" component={AuthStack} />
      </RootStack.Navigator>
    );
  }

  // Business user - show shop dashboard
  if (user.role === "business") {
    return <ShopTabNavigator />;
  }

  // Customer user - show customer app only (no auth stack)
  return <CustomerTabNavigator />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
