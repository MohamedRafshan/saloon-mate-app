import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function HelpScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Help Center</Text>
      <Text style={styles.text}>
        This is a placeholder for the Help Center screen.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: "#666",
  },
});
