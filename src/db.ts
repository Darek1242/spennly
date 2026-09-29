import Dexie, { type Table } from "dexie";

export interface Wallet {
  id?: number;
  name: string;
  user_id: string;
  color?: string;
  created_at?: string;
}

export interface Expense {
  id?: number;
  amount: number;
  category: string;
  date: Date;
  description: string;
  user_id?: string;
  wallet_id?: number;
}

export interface Category {
  id?: number;
  name: string;
  user_id?: string;
  wallet_id?: number;
}

export interface Income {
  id?: number;
  amount: number;
  date: Date;
  user_id?: string;
  wallet_id?: number;
}

export class MyFinanceDatabase extends Dexie {
  expenses!: Table<Expense>;
  categories!: Table<Category>;
  incomes!: Table<Income>;
  wallets!: Table<Wallet>;

  constructor() {
    super("FinanceDatabase");
    // Zmieniamy wersję na 3 i dodajemy wallet_id oraz nową tabelę portfeli
    this.version(3).stores({
      expenses: "++id, category, date, user_id, wallet_id",
      categories: "++id, name, user_id, wallet_id",
      incomes: "++id, date, user_id, wallet_id",
      wallets: "++id, name, user_id",
    });
  }
}

export const db = new MyFinanceDatabase();
