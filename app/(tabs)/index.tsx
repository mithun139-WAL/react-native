import { View, StyleSheet, Text } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { Colors } from "@/constants/Colors";

export default function HomeScreen() {
  const headerHeight = useHeaderHeight();
  return (
    <>
      <View style={[styles.titleContainer, {paddingTop: headerHeight}]}>
        <Text style={styles.headingTxt}>Welcome</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Colors.white
  },
  headingTxt: {
    fontSize: 20,
    fontWeight: '800',
    marginTop:40,
  }
});
