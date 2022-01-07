import { Action } from ".";
import { Account } from "../store/accounts";
import { Server } from "../store/servers";
import { Amount } from "../store/balances";
export type TransactionId = number;

export interface Transaction {
  server: Server;
  amount: Amount;
  symbol: string;
  receiver: Account;
  from: Account;
};

export interface TransactionState {
  newTransaction: Transaction;  
};

export const initialTransactionState = {
  newTransaction: { 
    server: {
      name: "Localhost",
      url: "/api"
    }, 
    amount: BigInt(0), 
    symbol: "", 
    receiver: {
      name: "",
      identity: null
    },
    from: {
      name: "",
      identity: null
    }
  },


};

export const transactionReducer = (
  state: TransactionState,
  { type, payload }: Action
) => {
  switch (type) {
    case "TRANSACTION.CREATE": {
      const newTransaction = payload;            
      return { ...state, newTransaction }
    }
    case "TRANSACTION.SENT": {
      return { ...state, initialTransactionState}
    }
    default:
      return state;
  }
}