import {Blockchain} from "../entities/blockchain.model";
import {Token} from "typedi";

export interface BlockchainValidator {
    validate(blockchain: Blockchain): Promise<boolean>;
}

export const BlockchainValidatorToken = new Token<BlockchainValidator>();
