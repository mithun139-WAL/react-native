import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  TouchableWithoutFeedback,
  FlatList,
  Alert,
} from "react-native";
import { useFinance } from "@/context/financeContext";
import { useHeaderHeight } from "@react-navigation/elements";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const DailyTracker = () => {
  const headerHeight = useHeaderHeight();
  const {
    getCarryForward,
    getTotalIncome,
    getTotalExpenses,
    getBalance,
    addIncome,
    addExpense,
    income,
    expenses,
    updateDailyBalance,
    setSelectedDates,
  } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"income" | "expense">("income");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const generateUniqueId = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const handleAddEntry = () => {
    if (!description || !amount || isNaN(parseFloat(amount))) {
      Alert.alert(
        "Invalid Input",
        "Please fill in all fields with valid data."
      );
      return;
    }
    const newEntry = {
      id: generateUniqueId(),
      amount: parseFloat(amount),
      category: description,
      date: selectedDate,
    };
    if (activeTab === "income") {
      addIncome(newEntry);
    } else {
      addExpense(newEntry);
    }
    setAmount("");
    setDescription("");
    setShowForm(false);
    updateDailyBalance(selectedDate);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    hideDatePicker();
    updateDailyBalance(date);
    setSelectedDates(date);
  };

  const formatDate = (date: Date) =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  useEffect(() => {
    updateDailyBalance(selectedDate);
  }, [income, expenses, selectedDate]);

  return (
    <View style={[styles.container, { paddingTop: headerHeight }]}>
      <View style={styles.headerContainer}>
        <View style={styles.dateContainer}>
          <Pressable
            onPress={() => {
              const previousDate = new Date(selectedDate);
              previousDate.setDate(selectedDate.getDate() - 1);
              setSelectedDate(previousDate);
              updateDailyBalance(previousDate);
              setSelectedDates(previousDate);
            }}
          >
            <Ionicons name="arrow-back" size={24} style={styles.arrow} />
          </Pressable>
          <Pressable onPress={showDatePicker}>
            <View style={styles.dateContainer}>
              <Text style={styles.day}>
                {selectedDate.getDate().toString().padStart(2, "0")}
              </Text>

              <View>
                <Text style={styles.dateText}>
                  {selectedDate.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
                <Text style={styles.dateText}>
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                  })}
                </Text>
              </View>
            </View>
          </Pressable>
        </View>
        <View style={styles.balanceContainer}>
          <View>
            <Text style={{ color: Colors.white, fontSize: 12 }}>Balance</Text>
            <Text style={styles.balanceText}>₹{getBalance(selectedDate)}</Text>
          </View>

          <Pressable
            onPress={() => {
              const nextDate = new Date(selectedDate);
              nextDate.setDate(selectedDate.getDate() + 1);
              setSelectedDate(nextDate);
              updateDailyBalance(nextDate);
              setSelectedDates(nextDate);
            }}
          >
            <Ionicons name="arrow-forward" size={24} style={styles.arrow} />
          </Pressable>
        </View>
      </View>
      <View style={styles.carryForward}>
        <Text>C/F:</Text>
        <Text>₹{getCarryForward(selectedDate)}</Text>
      </View>
      <View style={[styles.amountContainer, { backgroundColor: Colors.grey }]}>
        <Text style={styles.amountText}>Total Income</Text>
        <Text style={styles.amountText}>₹{getTotalIncome(selectedDate)}</Text>
      </View>
      <View style={styles.listContainer}>
        {income[formatDate(selectedDate)]?.length > 0 ? (
          <FlatList
            data={income[formatDate(selectedDate)]}
            renderItem={({ item }) => (
              <View style={styles.amountContainer}>
                <Text>{item.category}</Text>
                <Text>₹{item.amount}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ flexGrow: 0 }}
          />
        ) : (
          <Text style={styles.emptyListText}>
            Click '+' to add entries of income under Income
          </Text>
        )}
      </View>
      <View style={[styles.amountContainer, { backgroundColor: Colors.grey }]}>
        <Text style={styles.amountText}>Total Expenses</Text>
        <Text style={styles.amountText}>₹{getTotalExpenses(selectedDate)}</Text>
      </View>
      <View style={styles.listContainer}>
        {expenses[formatDate(selectedDate)]?.length > 0 ? (
          <FlatList
            data={expenses[formatDate(selectedDate)]}
            renderItem={({ item }) => (
              <View style={styles.amountContainer}>
                <Text>{item.category}</Text>
                <Text>₹{item.amount}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ flexGrow: 0 }}
          />
        ) : (
          <Text style={styles.emptyListText}>
            Click '+' to add entries of expense under Expense
          </Text>
        )}
      </View>
      <Pressable style={styles.addButton} onPress={() => setShowForm(true)}>
        <Text style={styles.addButtonText}>+</Text>
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
                <View style={styles.tabContainer}>
                  <Pressable
                    style={[
                      styles.tab,
                      activeTab === "income" && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab("income")}
                  >
                    <Text style={styles.tabText}>Income (Credit)</Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.tab,
                      activeTab === "expense" && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab("expense")}
                  >
                    <Text style={styles.tabText}>Expense (Debit)</Text>
                  </Pressable>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="What is it for?"
                  value={description}
                  onChangeText={setDescription}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Amount"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
                <Button title="OK" onPress={handleAddEntry} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 10,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: Colors.blue,
    paddingVertical: 16,
    borderRadius: 5,
    elevation: 10,
  },
  arrow: {
    fontSize: 18,
    paddingHorizontal: 20,
    color: Colors.white,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    color: Colors.white,
    paddingHorizontal: 10,
  },
  day: {
    fontSize: 24,
    fontWeight: "200",
    color: Colors.white,
    borderWidth: 1,
    borderColor: Colors.white,
    padding: 3,
    borderRadius: 10,
  },
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceText: {
    color: Colors.white,
    fontSize: 18,
  },
  carryForward: {
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  amountText: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontWeight: "500",
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  emptyListText: {
    padding: 16,
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
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#e0e0e0",
  },
  tabText: {
    fontSize: 16,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 16,
    padding: 8,
    fontSize: 16,
  },
});

export default DailyTracker;
