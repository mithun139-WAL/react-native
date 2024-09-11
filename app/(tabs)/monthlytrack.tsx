import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useHeaderHeight } from "@react-navigation/elements";
import { useFinance } from "@/context/financeContext";

const MonthlyTrack = () => {
  const headerHeight = useHeaderHeight();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const { getTotalIncome, getTotalExpenses, getBalance, income, expenses } =
    useFinance();

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [carryForward, setCarryForward] = useState(0);
  const [balance, setBalance] = useState(0);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setSelectedMonth(date);
    hideDatePicker();
  };

  useEffect(() => {
    const startOfMonth = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth(),
      1
    );
    const endOfMonth = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() + 1,
      0
    );

    let incomeSum = 0;
    let expenseSum = 0;

    for (
      let day = new Date(startOfMonth);
      day <= endOfMonth;
      day.setDate(day.getDate() + 1)
    ) {
      incomeSum += getTotalIncome(new Date(day));
      expenseSum += getTotalExpenses(new Date(day));
    }

    setTotalIncome(incomeSum);
    setTotalExpenses(expenseSum);

    const prevMonth = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth(),
      0
    );

    setCarryForward(getBalance(prevMonth));
    setBalance(carryForward + (incomeSum - expenseSum));

  }, [selectedMonth, getTotalIncome, getTotalExpenses, getBalance]);

  const renderDailyEntries = () => {
    const daysInMonth = [];
    const startOfMonth = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth(),
      1
    );
    const endOfMonth = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() + 1,
      0
    );

    for (
      let day = startOfMonth;
      day <= endOfMonth;
      day.setDate(day.getDate() + 1)
    ) {
      const dateKey = `${day.getFullYear()}-${
        day.getMonth() + 1
      }-${day.getDate()}`;
      const dailyIncome = income[dateKey] || [];
      const dailyExpenses = expenses[dateKey] || [];

      if (dailyIncome?.length > 0 || dailyExpenses?.length > 0) {
        const incomeTotal = dailyIncome.reduce(
          (total, entry) => total + entry.amount,
          0
        );
        const expensesTotal = dailyExpenses.reduce(
          (total, entry) => total + entry.amount,
          0
        );

        daysInMonth.push(
          <View key={dateKey} style={styles.dayContainer}>
            <View>
              <Text style={styles.dayText}>
                {day.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  marginBottom: 10,
                }}
              >
                <Text>Income(Credit)</Text>
                <Text>Expenses(Debit)</Text>
              </View>
              <View style={styles.entriesContainer}>
                <View style={styles.entryColumn}>
                  {dailyIncome.map((entry) => (
                    <View
                      key={entry.id}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={styles.catText}>{entry.category}</Text>
                      <Text style={styles.amtText}>₹{entry.amount}</Text>
                    </View>
                  ))}
                  <View
                    style={{ flexDirection: "row", justifyContent: "flex-end" }}
                  >
                    <Text style={styles.totalText}>₹{incomeTotal}</Text>
                  </View>
                </View>
                <View style={styles.entryColumn}>
                  {dailyExpenses.map((entry) => (
                    <View
                      key={entry.id}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={styles.catText}>{entry.category}</Text>
                      <Text style={styles.amtText}>₹{entry.amount}</Text>
                    </View>
                  ))}
                  <View
                    style={{ flexDirection: "row", justifyContent: "flex-end" }}
                  >
                    <Text style={styles.totalText}>₹{expensesTotal}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        );
      }
    }
    return daysInMonth;
  };

  return (
    <View style={[styles.container, { paddingTop: headerHeight }]}>
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
        <Pressable onPress={showDatePicker}>
          <Text style={styles.dateText}>
            <Text style={styles.dateText}>
              {selectedMonth.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </Text>
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

      <View style={styles.monthSummary}>
        <View style={{ padding: 0, margin: 0 }}>
          <Text style={styles.summaryText}>Total Income (credit):</Text>
          <Text style={styles.summaryText}>₹{totalIncome}</Text>
          <Text style={styles.summaryText}>C/F: ₹{carryForward}</Text>
        </View>
        <View style={{ padding: 0, margin: 0 }}>
          <Text style={styles.summaryText}>Total Expenses (debit):</Text>
          <Text style={styles.summaryText}>₹{totalExpenses}</Text>
          <Text style={styles.summaryText}>Balance: ₹{balance}</Text>
        </View>
      </View>

      <ScrollView style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
        {renderDailyEntries()}
      </ScrollView>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

export default MonthlyTrack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 10,
    backgroundColor: Colors.white,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    paddingHorizontal: 20,
    color: Colors.white,
  },
  monthSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.aqua,
    opacity: 0.6,
    paddingHorizontal: 10,
    paddingVertical: 10,
    elevation: 5,
    borderRadius: 5,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: "500",
    flexWrap: "wrap",
    overflow: "hidden",
    paddingVertical: 3,
  },
  dayContainer: {
    marginBottom: 16,
    // borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    backgroundColor: Colors.white,
    elevation: 2,
  },
  dayText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
    textAlign: "center",
  },
  entriesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  entryColumn: {
    flex: 1,
  },
  catText: {
    fontSize: 14,
    marginBottom: 4,
    paddingHorizontal: 10,
    fontWeight: "300",
  },
  amtText: {
    fontSize: 12,
    marginBottom: 4,
    paddingHorizontal: 10,
    fontWeight: "200",
    color: Colors.blue,
  },
  totalText: {
    fontSize: 14,
    marginTop: 8,
    color: Colors.error,
    fontWeight: "300",
    paddingHorizontal: 10,
  },
});
