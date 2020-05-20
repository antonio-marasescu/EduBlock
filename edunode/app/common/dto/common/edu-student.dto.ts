import {EduStudentEntity} from '../../entities/university/edu-student.entity';
import {objectWithoutKeys} from '../../utils/dictionary.utils';
import {IsNotEmpty, IsString} from 'class-validator';

export class EduStudentDto {
    @IsString()
    @IsNotEmpty()
    publicKey: string;

    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsString()
    @IsNotEmpty()
    groupId: string;

    @IsString()
    @IsNotEmpty()
    faculty: string;
}

export class EduStudentDtoMapper {
    public static toDto(entity: EduStudentEntity): EduStudentDto {
        const dto = new EduStudentDto();
        dto.publicKey = entity.publicKey;
        dto.fullName = entity.fullName;
        dto.groupId = entity.groupId;
        dto.faculty = entity.faculty;
        const sortedDto = new EduStudentDto();
        Object.assign(sortedDto, objectWithoutKeys(dto, []));
        return sortedDto;
    }

    public static toEntity(dto: EduStudentDto): EduStudentEntity {
        const entity = new EduStudentEntity();
        entity.publicKey = dto.publicKey;
        entity.fullName = dto.fullName;
        entity.groupId = dto.groupId;
        entity.faculty = dto.faculty;
        const sortedEntity = new EduStudentEntity();
        Object.assign(sortedEntity, objectWithoutKeys(entity, []));
        return sortedEntity;
    }
}
