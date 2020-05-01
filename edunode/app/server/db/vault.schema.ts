import {PersonalIdentity} from "../../common/entities/identity/personal-identity.entity";
import {CommonIdentity} from "../../common/entities/identity/common-identity.entity";
import {EduFileEntity} from "../../common/entities/files/edu-file.entity";

export const VAULT_SCHEMA = [PersonalIdentity, CommonIdentity, EduFileEntity];
