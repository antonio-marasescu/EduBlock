import {EduFileEntity} from "../../entities/files/edu-file.entity";

export class EduFileDto {
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
}

export class EduFileMapper {
    public static toEntity(dto: EduFileDto): EduFileEntity {
        const entity = new EduFileEntity();
        entity.filename = dto.originalname;
        entity.encoding = dto.encoding;
        entity.mimeType = dto.mimetype;
        entity.size = dto.size;
        entity.content = dto.buffer;
        return entity;
    }
}
