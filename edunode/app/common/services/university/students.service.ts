import {Inject, Service, Token} from 'typedi';
import {ServerLogger, ServerLoggerToken} from '../../logger/server-logger.interface';
import {IStudentRepositoryToken} from '../../repositories/university/student.interface.repository';
import {StudentRepository} from '../../repositories/university/student.repository';
import {EduStudentDto, EduStudentDtoMapper} from '../../dto/common/edu-student.dto';
import {EduStudentEntity} from '../../entities/university/edu-student.entity';
import {validate, ValidationError} from 'class-validator';
import {createValidationError} from '../../errors/edu.error.factory';

export const StudentsServiceToken = new Token<StudentsService>('services.university.students');

@Service(StudentsServiceToken)
export class StudentsService {
    constructor(
        @Inject(IStudentRepositoryToken) private studentRepository: StudentRepository,
        @Inject(ServerLoggerToken) private logger: ServerLogger,) {
    }

    public async getStudents(): Promise<EduStudentDto[]> {
        this.logger.logInfo(this, 'Find Student Service request started');
        const studentEntities: EduStudentEntity[] = await this.studentRepository.find({});
        this.logger.logSuccess(this, 'Find Student Service request finished');
        return studentEntities.map(entity => EduStudentDtoMapper.toDto(entity));
    }

    public async createStudent(studentDto: EduStudentDto): Promise<EduStudentDto> {
        this.logger.logInfo(this, 'Create Student Service request started');
        this.logger.logInfo(this, 'Create Student Data Transfer Object will be validated...');
        const validationErrors: ValidationError[] = await validate(studentDto);
        if (validationErrors.length > 0) {
            const error = createValidationError(validationErrors);
            this.logger.logError(this, JSON.stringify(error));
            throw error;
        }
        this.logger.logSuccess(this, 'Create Student Data Transfer Object has been validated successfully!');
        this.logger.logInfo(this, 'Saving new student to the local vault...');
        const entity = EduStudentDtoMapper.toEntity(studentDto);
        const savedEntity = await this.studentRepository.save(entity);
        this.logger.logSuccess(this, 'New student has been saved to the local vault!');
        this.logger.logSuccess(this, 'Create Student Service request finished');
        return EduStudentDtoMapper.toDto(savedEntity);
    }
}
