import { View, StyleSheet, Text } from "react-native";
import React from 'react';
import { useHeaderHeight } from "@react-navigation/elements";
import { Colors } from "@/constants/Colors";
import NotesList from "@/components/NoteList";

const note = () => {
  const headerHeight = useHeaderHeight();

  return (
      <View style={[styles.titleContainer, { paddingTop: headerHeight }]}>
        <NotesList />
      </View>
  );
}

export default note;
const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headingTxt: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 20,
  },
});
