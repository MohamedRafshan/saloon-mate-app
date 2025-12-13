import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { BusinessRegisterScreen } from "../auth/BusinessRegisterScreen";
import { LoginScreen } from "../auth/LoginScreen";
import { RegisterScreen } from "../auth/RegisterScreen";

export type AuthStackParamList = {
  Login: undefined;
  Register: { accountType?: "customer" | "business" };
  BusinessRegister: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "#fff" },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen
        name="BusinessRegister"
        component={BusinessRegisterScreen}
      />
    </Stack.Navigator>
  );
}
