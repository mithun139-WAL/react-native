import { Tabs } from "expo-router";
import React from "react";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors.aqua,
          borderTopWidth: 0,
          padding: 0,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: "700",
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          textAlignVertical: "center",
          width: "100%",
        },
        tabBarActiveBackgroundColor: Colors.blue,
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: Colors.grey,
        headerShown: false,
        
      }}
      initialRouteName="dailytrack"
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "create" : "create-outline"}
              size={28}
              color={color}
            />
          ),
          tabBarLabelStyle: {
            display: "none",
          },
          tabBarItemStyle: {
            width: 50,
          },
        }}
      />
      <Tabs.Screen
        name="dailytrack"
        options={{
          title: "DAILY",
          tabBarIconStyle: {
            display: "none",
          },
        }}
      />
      <Tabs.Screen
        name="monthlytrack"
        options={{
          title: "MONTHLY",
          tabBarIconStyle: {
            display: "none",
          },
        }}
      />
      <Tabs.Screen
        name="yearlytrack"
        options={{
          title: "YEARLY",
          tabBarIconStyle: {
            display: "none",
          },
        }}
      />
    </Tabs>
  );
}
