/**
 * Home Screen - Displays all habits for today.
 *
 * Design matches the specification:
 * - "My Habits" title with date subtitle
 * - Progress card with completion count and progress bar
 * - Habit list with circular checkboxes
 * - "+ Add Habit" button pinned to bottom
 */

import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHabits } from "../context/HabitContext";
import { getTodayString } from "../utils/date";

// Format date as "Friday, May 30"
function formatDateDisplay(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function HomeScreen() {
  const { state, dispatch } = useHabits();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const today = getTodayString();

  const todayCompletions = state.completions[today] || {};

  // Progress calculation
  const completedCount = state.habits.filter(
    (h) => todayCompletions[h.id]
  ).length;
  const totalCount = state.habits.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleToggle = (habitId: string) => {
    dispatch({
      type: "TOGGLE_COMPLETE",
      payload: { habitId, date: today },
    });
  };

  // Loading state
  if (!state.isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500 text-[15px]">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      {/* Scrollable content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 100, // Space for bottom button
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-[28px] font-bold text-gray-900">My Habits</Text>
          <Text className="text-[15px] text-gray-500 mt-1">
            {formatDateDisplay(today)}
          </Text>
        </View>

        {/* Progress Card */}
        {totalCount > 0 && (
          <View className="bg-indigo-50 rounded-xl p-4 mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-[14px] font-semibold text-gray-900">
                Today's Progress
              </Text>
              <Text className="text-[14px] font-semibold text-indigo-600">
                {completedCount} of {totalCount}
              </Text>
            </View>
            {/* Progress Bar */}
            <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </View>
          </View>
        )}

        {/* Empty State */}
        {state.habits.length === 0 ? (
          <View className="items-center justify-center py-16">
            <Text className="text-gray-400 text-[15px] text-center">
              No habits yet.{"\n"}Tap the button below to add your first habit.
            </Text>
          </View>
        ) : (
          /* Habit List */
          <View className="gap-3">
            {state.habits.map((habit) => {
              const isCompleted = todayCompletions[habit.id] || false;

              return (
                <Pressable
                  key={habit.id}
                  onPress={() => handleToggle(habit.id)}
                  className={`
                    flex-row items-center h-[60px] px-4 rounded-xl border
                    ${isCompleted ? "bg-neutral-100 border-gray-200" : "bg-white border-gray-200"}
                  `}
                  android_ripple={{ color: "rgba(0,0,0,0.05)" }}
                >
                  {/* Circular Checkbox */}
                  <View
                    className={`
                      w-[26px] h-[26px] rounded-full items-center justify-center mr-4
                      ${isCompleted ? "bg-emerald-500" : "border-2 border-gray-200"}
                    `}
                  >
                    {isCompleted && (
                      <Text className="text-white text-[14px] font-bold">✓</Text>
                    )}
                  </View>

                  {/* Habit Name */}
                  <Text
                    className={`
                      text-[15px] font-medium flex-1
                      ${isCompleted ? "text-gray-500" : "text-gray-900"}
                    `}
                  >
                    {habit.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View
        className="absolute left-0 right-0 px-6"
        style={{ bottom: insets.bottom + 16 }}
      >
        <Pressable
          onPress={() => router.push("/add-habit")}
          className="bg-indigo-600 h-[52px] rounded-xl flex-row items-center justify-center active:bg-indigo-700"
          android_ripple={{ color: "rgba(255,255,255,0.2)" }}
        >
          <Text className="text-white text-[20px] font-light mr-2">+</Text>
          <Text className="text-white text-[16px] font-semibold">Add Habit</Text>
        </Pressable>
      </View>
    </View>
  );
}
