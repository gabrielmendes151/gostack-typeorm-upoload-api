import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionalRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const balance = await transactionalRepository.getBalance();
    if (type === 'outcome' && balance.outcome + value > balance.income) {
      throw new AppError('Outcome cannot be greater than income.', 400);
    }

    const categoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    let category_id;

    if (categoryExists) {
      category_id = categoryExists.id;
    } else {
      const categoryCreated = await categoryRepository.create({
        title: category,
      });
      const categorySaved = await categoryRepository.save(categoryCreated);
      category_id = categorySaved.id;
    }

    const transactionCreated = await transactionalRepository.create({
      title,
      value,
      type,
      category_id,
    });

    const transaction = await transactionalRepository.save(transactionCreated);

    return transaction;
  }
}

export default CreateTransactionService;
