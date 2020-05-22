import {EduUserEntity} from '../../entities/university/edu-user.entity';
import {objectWithoutKeys} from '../../utils/dictionary.utils';
import {IsNotEmpty, IsString} from 'class-validator';

export class EduUserDto {
    id?: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    role?: string;
}

export class EduUserDtoMapper {
    public static toEntity(dto: EduUserDto): EduUserEntity {
        const entity = new EduUserEntity();
        entity.email = dto.email;
        entity.password = dto.password;
        const sortedEntity = new EduUserEntity();
        Object.assign(sortedEntity, objectWithoutKeys(entity, []));
        return sortedEntity;
    }

    public static toDto(entity: EduUserEntity): EduUserDto {
        const dto = new EduUserDto();
        dto.id = entity.id;
        dto.email = entity.email;
        dto.role = entity.role;
        const sortedDto = new EduUserDto();
        Object.assign(sortedDto, objectWithoutKeys(dto, []));
        return sortedDto;
    }
}
