import {Inject, Service, Token} from 'typedi';
import {BasicApi} from '../basic.api';
import express from 'express';
import {FilesService, FilesServiceToken} from '../../services/common/files.service';
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import {EduFileDto} from '../../dto/common/edu-file.dto';
import {createInvalidRequestParamsError} from '../../errors/edu.error.factory';
import {EduFileEntity} from '../../entities/files/edu-file.entity';

export const FilesApiToken = new Token<FilesApi>('api.routes.files');

@Service(FilesApiToken)
export class FilesApi implements BasicApi {
    private readonly router: express.Router;
    private readonly multerMiddleware: any;

    constructor(@Inject(FilesServiceToken) private filesService: FilesService) {
        this.router = express.Router();

        this.multerMiddleware = multer();
        this.registerRoutes();

    }

    public getRouter(): express.Router {
        return this.router;
    }

    private registerRoutes() {
        this.router.post('/api/files', this.multerMiddleware.single('file'), asyncHandler(
            async (req, res) => this.handleUploadFile(req, res)));
        this.router.get('/api/files/:transactionHashId/:fileHashId', asyncHandler(
            async (req, res) => this.getFile(req, res)));
        this.router.get('/api/files/:transactionHashId', asyncHandler(
            async (req, res) => this.getFilesForTransaction(req, res)));
    }

    private async handleUploadFile(req, res) {
        const dto: EduFileDto = req.file;
        if (!dto) {
            throw createInvalidRequestParamsError('dto');
        }
        const savedFile = await this.filesService.saveFile(dto);
        res.send(savedFile);
    }


    private async getFile(req, res) {
        const hashId: string = req.params.fileHashId;
        if (!hashId) {
            throw createInvalidRequestParamsError('fileHashId');
        }
        const foundFile: EduFileEntity = await this.filesService.getFile(hashId);
        res.send(foundFile);
    }

    private async getFilesForTransaction(req, res) {
        const transactionHashId: string = req.params.transactionHashId;
        if (!transactionHashId) {
            throw createInvalidRequestParamsError('transactionHashId');
        }
        const foundFiles: EduFileEntity[] = await this.filesService.getFilesForTransaction(transactionHashId);
        res.send(foundFiles);
    }
}
