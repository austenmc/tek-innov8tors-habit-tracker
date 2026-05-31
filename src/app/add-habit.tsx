/**
 * Add Habit Screen - Form to create a new habit.
 *
 * Design matches the specification:
 * - "< Back" navigation link
 * - "Add New Habit" title with subtitle
 * - Text input with "Habit Name" label
 * - Tips section with bullet points
 * - "+ Add Habit" button pinned to bottom
 */

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHabits } from "../context/HabitContext";

// Tips for creating good habits
const TIPS = [
  "Be specific — 'Read 10 pages' not 'Read more'",
  "Start small — build momentum first",
  "Tie it to an existing routine",
];

export default function AddHabitScreen() {
  const [habitName, setHabitName] = useState("");
  const { dispatch } = useHabits();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSubmit = () => {
    const trimmedName = habitName.trim();
    if (!trimmedName) return;

    dispatch({
      type: "ADD_HABIT",
      payload: { name: trimmedName },
    });

    router.back();
  };

  const isValid = habitName.trim().length > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top }}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center py-4 -ml-1"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text className="text-indigo-600 text-[17px] font-normal">
            {"<"} Back
          </Text>
        </Pressable>

        {/* Header */}
        <View className="mb-8 mt-2">
          <Text className="text-[28px] font-bold text-gray-900">
            Add New Habit
          </Text>
          <Text className="text-[15px] text-gray-500 mt-1">
            Create a habit you want to track daily.
          </Text>
        </View>

        {/* Form */}
        <View className="gap-6">
          {/* Habit Name Input */}
          <View>
            <Text className="text-[13px] font-semibold text-gray-500 mb-2 tracking-wide">
              Habit Name
            </Text>
            <TextInput
              value={habitName}
              onChangeText={setHabitName}
              placeholder="e.g. Morning Run"
              placeholderTextColor="#C4C4C4"
              className="h-[52px] px-4 rounded-xl border-[1.5px] border-gray-200 text-[16px] text-gray-900"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              autoCapitalize="sentences"
              autoCorrect
            />
          </View>

          {/* Tips Section */}
          <View>
            <Text className="text-[14px] font-semibold text-gray-900 mb-3">
              Tips for good habits:
            </Text>
            <View className="gap-2">
              {TIPS.map((tip, index) => (
                <View key={index} className="flex-row items-start">
                  {/* Bullet */}
                  <View className="w-[5px] h-[5px] rounded-full bg-indigo-600 mt-[7px] mr-3" />
                  <Text className="text-[13px] text-gray-500 flex-1 leading-5">
                    {tip}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View
        className="absolute left-0 right-0 px-6 bg-white"
        style={{ bottom: insets.bottom + 16 }}
      >
        <Pressable
          onPress={handleSubmit}
          disabled={!isValid}
          className={`
            h-[52px] rounded-xl flex-row items-center justify-center
            ${isValid ? "bg-indigo-600 active:bg-indigo-700" : "bg-indigo-300"}
          `}
          android_ripple={isValid ? { color: "rgba(255,255,255,0.2)" } : undefined}
        >
          <Text className="text-white text-[20px] font-light mr-2">+</Text>
          <Text className="text-white text-[16px] font-semibold">Add Habit</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
