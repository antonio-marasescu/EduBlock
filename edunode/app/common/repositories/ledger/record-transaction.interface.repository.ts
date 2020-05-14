import {Token} from "typedi";
import {Repository} from "typeorm";
import {RecordTransactionEntity} from "../../entities/ledger/record-transaction.entity";

export interface IRecordTransactionRepository extends Repository<RecordTransactionEntity> {
    getTransactionsForBlock(blockHash: string): Promise<RecordTransactionEntity[]>;
}

export const IRecordTransactionRepositoryToken = new Token<IRecordTransactionRepository>('repositories.ledger.record-transaction');
