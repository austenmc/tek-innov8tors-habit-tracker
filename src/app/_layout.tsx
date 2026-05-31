/**
 * Root Layout - The app's entry point and structure.
 *
 * Uses headerShown: false since we have custom headers in each screen
 * matching the design specification.
 */

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { HabitProvider } from "../context/HabitContext";

import "../global.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      {/* Dark status bar text for light backgrounds */}
      <StatusBar style="dark" />

      <HabitProvider>
        <Stack
          screenOptions={{
            headerShown: false, // Custom headers in each screen
            animation: "slide_from_right",
            contentStyle: { backgroundColor: "#FFFFFF" },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen
            name="add-habit"
            options={{ animation: "slide_from_bottom" }}
          />
        </Stack>
      </HabitProvider>
    </SafeAreaProvider>
  );
}
