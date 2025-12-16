import { Stack } from "expo-router";
import React from "react";

import "../src/firebaseConfig";

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
