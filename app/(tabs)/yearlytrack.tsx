import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useFinance } from "@/context/financeContext";

const YearlyTrack = () => {
  const headerHeight = useHeaderHeight();
  const [selectedYear, setSelectedYear] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const { getBalance, getTotalExpenses, getTotalIncome } = useFinance();

  const [carryForward, setCarryForward] = useState(0);
  const [monthlyData, setMonthlyData] = useState<
    { month: string; income: number; expenses: number; balance: number }[]
  >([]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setSelectedYear(date);
    hideDatePicker();
  };

  const calculateMonthlyData = () => {
    const year = selectedYear.getFullYear();
    const data = [];

    let carryForward = 0;

    for (let month = 0; month < 12; month++) {
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 0);

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

      const balance = carryForward + (incomeSum - expenseSum);
      data.push({
        month: startOfMonth.toLocaleString("default", { month: "short" }),
        income: incomeSum,
        expenses: expenseSum,
        balance: balance,
      });

      carryForward = balance;
    }

    setMonthlyData(data);
  };

  useEffect(() => {
    calculateMonthlyData();
    const prevYear = new Date(selectedYear.getFullYear(), 0, 0);
    setCarryForward(getBalance(prevYear));
  }, [selectedYear]);

  return (
    <View style={[styles.container, { paddingTop: headerHeight }]}>
      <View style={styles.dateContainer}>
        <Pressable
          onPress={() => {
            const previousYear = new Date(selectedYear);
            previousYear.setFullYear(selectedYear.getFullYear() - 1);
            setSelectedYear(previousYear);
          }}
        >
          <Ionicons name="arrow-back" size={24} style={styles.arrow} />
        </Pressable>
        <Pressable onPress={showDatePicker}>
          <Text style={styles.dateText}>
            <Text style={styles.dateText}>
              {selectedYear.toLocaleDateString("en-US", {
                year: "numeric",
              })}
            </Text>
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            const nextYear = new Date(selectedYear);
            nextYear.setFullYear(selectedYear.getFullYear() + 1);
            setSelectedYear(nextYear);
          }}
        >
          <Ionicons name="arrow-forward" size={24} style={styles.arrow} />
        </Pressable>
      </View>

      <View style={styles.summaryTable}>
        <View style={styles.tableRow}>
          <Text
            style={[styles.cell, { textAlign: "left", flex: 0, width: 50 }]}
          ></Text>
          <Text style={[styles.cell, { fontWeight: "600" }]}>
            Income (Credit)
          </Text>
          <Text style={[styles.cell, { fontWeight: "600" }]}>
            Expense (Debit)
          </Text>
          <Text style={[styles.cell, { fontWeight: "600" }]}>Balance</Text>
        </View>
        <View style={styles.tableRow}>
          <Text
            style={[
              styles.cell,
              { color: Colors.blue, textAlign: "left", flex: 0, width: 50 },
            ]}
          >
            C/F:
          </Text>
          <Text style={styles.cell}></Text>
          <Text style={styles.cell}></Text>
          <Text style={styles.cell}>₹{carryForward}</Text>
        </View>

        {monthlyData
          .filter((data) => data.income !== 0 || data.expenses !== 0) // Filter out months with no income or expenses
          .map((data, index) => (
            <View key={index} style={styles.tableRow}>
              <Text
                style={[styles.cell, { textAlign: "left", flex: 0, width: 50 }]}
              >
                {data.month}
              </Text>
              <Text style={styles.cell}>₹{data.income.toFixed(2)}</Text>
              <Text style={styles.cell}>₹{data.expenses.toFixed(2)}</Text>
              <Text style={styles.cell}>₹{data.balance.toFixed(2)}</Text>
            </View>
          ))}
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

export default YearlyTrack;

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
  summaryTable: {
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  cell: {
    flex: 1,
    paddingVertical: 5,
    textAlign: "right",
    fontSize: 14,
    color: Colors.black,
  },
});
