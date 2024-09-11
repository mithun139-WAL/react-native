import React, { createContext, useState, ReactNode } from "react";

interface FinanceEntry {
  id: string;
  amount: number;
  category: string;
  date: Date;
}

interface DailyBalance {
  day: string;
  balance: number;
  carryForward: number;
}

interface FinanceContextType {
  expenses: { [key: string]: FinanceEntry[] };
  income: { [key: string]: FinanceEntry[] };
  addExpense: (entry: FinanceEntry) => void;
  addIncome: (entry: FinanceEntry) => void;
  getCarryForward: (date: Date) => number;
  getTotalIncome: (date: Date) => number;
  getTotalExpenses: (date: Date) => number;
  getBalance: (date: Date) => number;
  updateDailyBalance: (date: Date) => void;
  setSelectedDates: (date: Date) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [expenses, setExpenses] = useState<{ [key: string]: FinanceEntry[] }>(
    {}
  );
  const [income, setIncome] = useState<{ [key: string]: FinanceEntry[] }>({});
  const [dailyBalances, setDailyBalances] = useState<DailyBalance[]>([]);
  const [selectedDate, setSelectedDates] = useState(new Date());

  const formatDateKey = (date: Date) =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  const addExpense = (entry: FinanceEntry) => {
    const dateKey = formatDateKey(entry.date);
    setExpenses((prev) => {
      const updatedExpenses = {
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), entry],
      };
      updateDailyBalance(entry.date);
      return updatedExpenses;
    });
  };

  const addIncome = (entry: FinanceEntry) => {
    const dateKey = formatDateKey(entry.date);
    setIncome((prev) => {
      const updatedIncome = {
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), entry],
      };
      updateDailyBalance(entry.date);
      return updatedIncome;
    });
  };

  const getTotalIncome = (date: Date) => {
    const dateKey = formatDateKey(date);
    return (income[dateKey] || []).reduce(
      (total, entry) => total + entry.amount,
      0
    );
  };

  const getTotalExpenses = (date: Date) => {
    const dateKey = formatDateKey(date);
    return (expenses[dateKey] || []).reduce(
      (total, entry) => total + entry.amount,
      0
    );
  };

  const getBalance = (date: Date) => {
    const totalIncome = getTotalIncome(date);
    const totalExpenses = getTotalExpenses(date);
    const carryForward = getCarryForward(date);

    return carryForward + (totalIncome - totalExpenses);
  };

  const getCarryForward = (date: Date) => {
    const previousDate = new Date(date);
    previousDate.setDate(date.getDate() - 1);
    const previousDateKey = formatDateKey(previousDate);

    const previousDayBalance =
      dailyBalances.find((balance) => balance.day === previousDateKey)
        ?.balance || 0;

    return previousDayBalance;
  };

  const updateDailyBalance = (date: Date) => {
    const dateKey = formatDateKey(date);
    const newDailyBalances = [...dailyBalances];
    const balance = getBalance(date);
    const carryForward = getCarryForward(date);

    let index = newDailyBalances.findIndex(
      (balance) => balance.day === dateKey
    );

    if (index >= 0) {
      newDailyBalances[index] = { day: dateKey, balance, carryForward };
    } else {
      newDailyBalances.push({ day: dateKey, balance, carryForward });
    }

    let carryForwardValue = balance;
    const sortedDates = newDailyBalances
      .filter((balance) => new Date(balance.day) > date)
      .sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());

    for (const nextDate of sortedDates) {
      const nextDateKey = nextDate.day;
      const nextIndex = newDailyBalances.findIndex(
        (balance) => balance.day === nextDateKey
      );

      if (nextIndex >= 0) {
        newDailyBalances[nextIndex] = {
          ...newDailyBalances[nextIndex],
          carryForward: carryForwardValue,
        };
        carryForwardValue = newDailyBalances[nextIndex].balance;
      }
    }

    setDailyBalances(newDailyBalances);
  };

  React.useEffect(() => {
    updateDailyBalance(selectedDate);
  }, [selectedDate]);

  React.useEffect(() => {
    updateDailyBalance(selectedDate);
  }, [income, expenses, selectedDate]);

  return (
    <FinanceContext.Provider
      value={{
        expenses,
        income,
        addExpense,
        addIncome,
        getCarryForward,
        getTotalIncome,
        getTotalExpenses,
        getBalance,
        updateDailyBalance,
        setSelectedDates,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = React.useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};
