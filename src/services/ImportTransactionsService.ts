/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import path from 'path';
import Transaction from '../models/Transaction';
import loadCSV from '../csv/config';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(): Promise<Transaction[]> {
    const createTransactionalService = new CreateTransactionService();

    const data = await loadCSV(
      path.resolve(__dirname, '..', 'csv', 'import_template.csv'),
    );

    const transactions: Transaction[] = [];

    for (const item of data) {
      const transaction = await createTransactionalService.execute({
        ...item,
      });
      transactions.push(transaction);
    }

    return new Promise<Transaction[]>(resolve => {
      resolve(transactions);
    });
  }
}

export default ImportTransactionsService;
