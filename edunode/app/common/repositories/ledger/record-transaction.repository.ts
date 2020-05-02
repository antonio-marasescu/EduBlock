import {EntityRepository, Repository} from "typeorm";
import {IRecordTransactionRepository} from "./record-transaction.interface.repository";
import {RecordTransactionEntity} from "../../entities/ledger/record-transaction.entity";

@EntityRepository(RecordTransactionEntity)
export class RecordTransactionRepository extends Repository<RecordTransactionEntity> implements IRecordTransactionRepository {

    getTransactionsForBlock(blockHash: string): Promise<RecordTransactionEntity[]> {
        return this.find({blockHash: blockHash});
    }

}
