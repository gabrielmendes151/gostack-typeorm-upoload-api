import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionalRepository = getCustomRepository(TransactionsRepository);

    const transactional = await transactionalRepository.findOne({
      where: { id },
    });

    if (!transactional) {
      throw new AppError('Not find the transaction', 400);
    }

    await transactionalRepository.delete(id);
  }
}

export default DeleteTransactionService;
