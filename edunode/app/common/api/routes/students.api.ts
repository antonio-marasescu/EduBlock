import {Inject, Service, Token} from 'typedi';
import {BasicApi} from '../basic.api';
import express from 'express';
import asyncHandler from 'express-async-handler';
import {StudentsService, StudentsServiceToken} from '../../services/university/students.service';
import {EduStudentDto} from '../../dto/common/edu-student.dto';

export const StudentsApiToken = new Token<StudentsApi>('api.routes.students');

@Service(StudentsApiToken)
export class StudentsApi implements BasicApi {

    private readonly router: express.Router;

    constructor(@Inject(StudentsServiceToken) private studentsService: StudentsService) {
        this.router = express.Router();
        this.registerRoutes();
    }

    public getRouter(): express.Router {
        return this.router;
    }

    private registerRoutes() {
        this.router.get('/api/students',
            asyncHandler(async (_req, res) => this.handleGetStudents(res)));
        this.router.post('/api/students',
            asyncHandler(async (req, res) => this.handleCreateStudent(req, res)));
    }

    private async handleGetStudents(res) {
        const studentsDto: EduStudentDto[] = await this.studentsService.getStudents();
        res.json(studentsDto);
    }

    private async handleCreateStudent(req, res) {
        const studentToBeCreated = new EduStudentDto();
        Object.assign(studentToBeCreated, req.body);
        const studentDto: EduStudentDto = await this.studentsService.createStudent(studentToBeCreated);
        res.json(studentDto);
    }
}
