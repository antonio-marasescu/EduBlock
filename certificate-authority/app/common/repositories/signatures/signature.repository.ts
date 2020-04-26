import {EntityRepository, Repository} from "typeorm";
import {SignatureEntity} from "../../entities/signatures/signature.entity";
import ISignatureRepository from "./signature.interface.repository";

@EntityRepository(SignatureEntity)
export class SignatureRepository extends Repository<SignatureEntity> implements ISignatureRepository {
}
