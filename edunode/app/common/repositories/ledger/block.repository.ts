import {EntityRepository, Repository} from "typeorm";
import {BlockEntity} from "../../entities/ledger/block.entity";
import {IBlockRepository} from "./block.interface.repository";

@EntityRepository(BlockEntity)
export class BlockRepository extends Repository<BlockEntity> implements IBlockRepository {

}
