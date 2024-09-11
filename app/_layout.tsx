import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "../constants/Colors";
import { FinanceProvider } from "@/context/financeContext";
import { NoteProvider } from "@/context/noteContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <FinanceProvider>
      <NoteProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: true,
                headerTransparent: true,
                headerTitle: "",
                headerStyle:{
                  backgroundColor: Colors.aqua,
                },
                headerLeft: () => (
                  <View style={styles.headerLeft}>
                    <Text style={styles.headerTitle}>Finance Tracker</Text>
                  </View>
                ),
                headerRight: () => (
                  <Pressable onPress={() => {}} style={styles.headerRight}>
                    <Image
                      source={{ uri: "https://shorturl.at/sLOZl" }}
                      style={styles.headerImage}
                    />
                  </Pressable>
                ),
              }}
            />
          </Stack>
        </ThemeProvider>
      </NoteProvider>
    </FinanceProvider>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    padding: 0,
  },
  headerTitle: {
    fontSize: 24,
    color: Colors.white,
    fontWeight: "600",
    fontVariant: ['small-caps']
  },
  headerRight: {
    marginLeft: 20,
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20, // Adjust to ensure it’s circular
  },
});
