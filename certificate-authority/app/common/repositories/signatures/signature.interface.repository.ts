import {Repository} from "typeorm";
import {SignatureEntity} from "../../entities/signatures/signature.entity";
import {Token} from "typedi";

export default interface ISignatureRepository extends Repository<SignatureEntity> {
}

export const ISignatureRepositoryToken = new Token<ISignatureRepository>('repositories.signatures');
