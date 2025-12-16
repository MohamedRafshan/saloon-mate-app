import { createStackNavigator } from "@react-navigation/stack";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, AppState, StyleSheet, View } from "react-native";
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

  // Business user - show shop dashboard
  if (user && user.role === "business") {
    return <ShopTabNavigator />;
  }

  // Default - show customer app (works for both logged in and logged out customers)
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
