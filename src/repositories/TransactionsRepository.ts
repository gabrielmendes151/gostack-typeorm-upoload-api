/* eslint-disable radix */
import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const normalize = { income: 0, outcome: 0, total: 0 };

    const transactions = await this.find();
    transactions.forEach(transaction => {
      const value: number = +transaction.value;
      if (transaction.type === 'income') {
        normalize.income += value;
      } else {
        normalize.outcome += value;
      }
    });
    normalize.total = normalize.income - normalize.outcome;
    return new Promise<Balance>(resolve => {
      resolve(normalize);
    });
  }
}

export default TransactionsRepository;
