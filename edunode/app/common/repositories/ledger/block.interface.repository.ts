import {Token} from "typedi";
import {Repository} from "typeorm";
import {BlockEntity} from "../../entities/ledger/block.entity";

export interface IBlockRepository extends Repository<BlockEntity> {

}

export const IBlockRepositoryToken = new Token<IBlockRepository>('repositories.ledger.block');
