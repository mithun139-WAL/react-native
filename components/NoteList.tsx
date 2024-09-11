import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import { useNotes } from "@/context/noteContext";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Colors } from "@/constants/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const NoteList = () => {
  const { notes, addNote, deleteNote, editNote } = useNotes();
  const [noteContent, setNoteContent] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isMonthPicker, setIsMonthPicker] = useState(false);

  const [editNoteId, setEditNoteId] = useState<string | null>(null);
  const [editNoteContent, setEditNoteContent] = useState<string>("");

  const [showEditForm, setShowEditForm] = useState(false);

  const handleAddNote = () => {
    if (noteContent.trim() !== "") {
      addNote(noteContent, selectedDate);
      setNoteContent("");
    }
    setShowForm(false);
  };

  const showDatePicker = (isMonth = false) => {
    setIsMonthPicker(isMonth);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    if (isMonthPicker) {
      setSelectedMonth(date);
    } else {
      setSelectedDate(date);
    }
    hideDatePicker();
  };

  const filteredNotes = notes.filter((note) => {
    const noteDate = new Date(note.date);
    return (
      noteDate.getMonth() === selectedMonth.getMonth() &&
      noteDate.getFullYear() === selectedMonth.getFullYear()
    );
  });

  const startEditNote = (id: string, content: string) => {
    setEditNoteId(id);
    setEditNoteContent(content);
    setShowEditForm(true);
  };

  const handleEditNote = () => {
    if (editNoteId && editNoteContent.trim() !== "") {
      const newDate = new Date(selectedDate);
      editNote(editNoteId, editNoteContent, newDate);
      setEditNoteId(null);
      setEditNoteContent("");
      setShowEditForm(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Pressable
          onPress={() => {
            const previousMonth = new Date(selectedMonth);
            previousMonth.setMonth(selectedMonth.getMonth() - 1);
            setSelectedMonth(previousMonth);
          }}
        >
          <Ionicons name="arrow-back" size={24} style={styles.arrow} />
        </Pressable>
        <Pressable onPress={() => showDatePicker(true)}>
          <Text style={styles.dateText}>
            {selectedMonth.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            const nextMonth = new Date(selectedMonth);
            nextMonth.setMonth(selectedMonth.getMonth() + 1);
            setSelectedMonth(nextMonth);
          }}
        >
          <Ionicons name="arrow-forward" size={24} style={styles.arrow} />
        </Pressable>
      </View>
      {filteredNotes?.length > 0 ? (
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.noteContainer}>
              <View style={styles.cardHeader}>
                <Text style={styles.headerText}>
                  {item.date.toDateString()}
                </Text>
                <View style={styles.noteMode}>
                  <Pressable
                    onPress={() => startEditNote(item.id, item.content)}
                  >
                    <Text style={styles.headerText}>
                      <MaterialIcons
                        name="edit"
                        size={18}
                        color={Colors.blue}
                      />
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => deleteNote(item.id)}>
                    <Text style={styles.headerText}>
                      <Ionicons name="trash" size={18} color={Colors.error} />
                    </Text>
                  </Pressable>
                </View>
              </View>
              <View style={styles.noteContent}>
                <Text>{item.content}</Text>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={{ alignItems: "center" }}>
          <Text>No Notes Found</Text>
        </View>
      )}
      <Pressable style={styles.addButton} onPress={() => setShowForm(true)}>
        <Text style={styles.addButtonText}>
          <Ionicons name="create" size={28} />
        </Text>
      </Pressable>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <Modal
        transparent={true}
        animationType="slide"
        visible={showForm}
        onRequestClose={() => setShowForm(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowForm(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.dateContainer}>
                  <Pressable
                    onPress={() => {
                      const previousDate = new Date(selectedDate);
                      previousDate.setDate(selectedDate.getDate() - 1);
                      setSelectedDate(previousDate);
                    }}
                  >
                    <Ionicons
                      name="arrow-back"
                      size={24}
                      style={styles.arrow}
                    />
                  </Pressable>
                  <Pressable onPress={() => showDatePicker(false)}>
                    <Text style={styles.dateText}>
                      <Text style={styles.day}>
                        {selectedDate.getDate().toString().padStart(2, "0")}
                      </Text>{" "}
                      <Text style={styles.month}>
                        {" "}
                        {selectedDate.toLocaleString("en-US", {
                          month: "short",
                        })}
                      </Text>{" "}
                      <Text style={styles.year}>
                        {" "}
                        {selectedDate.getFullYear()}
                      </Text>{" "}
                      <Text>
                        {selectedDate.toLocaleDateString("en-US", {
                          weekday: "long",
                        })}
                      </Text>
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      const nextDate = new Date(selectedDate);
                      nextDate.setDate(selectedDate.getDate() + 1);
                      setSelectedDate(nextDate);
                    }}
                  >
                    <Ionicons
                      name="arrow-forward"
                      size={24}
                      style={styles.arrow}
                    />
                  </Pressable>
                </View>
                <TextInput
                  style={styles.input}
                  multiline={true}
                  numberOfLines={20}
                  value={noteContent}
                  placeholder={"Add Note...."}
                  onChangeText={setNoteContent}
                />
                <Button title="ADD" onPress={handleAddNote} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        transparent={true}
        animationType="slide"
        visible={showEditForm}
        onRequestClose={() => setShowEditForm(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowEditForm(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <TextInput
                  style={styles.input}
                  multiline={true}
                  value={editNoteContent}
                  placeholder={"Edit Note...."}
                  onChangeText={setEditNoteContent}
                />
                <Button title="Save Changes" onPress={handleEditNote} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
const rowview = StyleSheet.create({
  rowStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    padding: 8,
    marginBottom: 16,
    borderRadius: 5,
    textAlignVertical: "top",
    height: 350,
  },
  noteContainer: {
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  noteMode: {
    ...rowview.rowStyle,
    paddingHorizontal: 16,
  },
  cardHeader: {
    ...rowview.rowStyle,
    marginBottom: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.blue,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 10,
  },
  noteContent: {
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  deleteButton: {
    color: "red",
  },
  dateContainer: {
    ...rowview.rowStyle,
    marginBottom: 16,
    backgroundColor: Colors.blue,
    paddingVertical: 20,
    borderRadius: 5,
    elevation: 10,
  },
  dateText: {
    color: Colors.white,
    padding: 0,
    fontSize: 18,
  },
  arrow: {
    fontSize: 18,
    paddingHorizontal: 10,
    color: Colors.white,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: Colors.blue,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
  },
  addButtonText: {
    fontSize: 30,
    color: Colors.white,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  day: {
    fontSize: 24,
    fontWeight: "200",
  },
  month: {},
  year: {},
});

export default NoteList;
