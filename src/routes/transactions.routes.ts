import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionalRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionalRepository.find();
  const balance = await transactionalRepository.getBalance();

  const allTransactionsWithBalence = {
    transactions,
    balance,
  };
  return response.json(allTransactionsWithBalence);
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const transactionalService = new CreateTransactionService();
  const transaction = await transactionalService.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteTransactionService = new DeleteTransactionService();

  await deleteTransactionService.execute(id);

  return response.status(200).send();
});

transactionsRouter.post('/import', async (request, response) => {
  const importService = new ImportTransactionsService();
  const transactions = await importService.execute();

  return response.json(transactions);
});

export default transactionsRouter;
