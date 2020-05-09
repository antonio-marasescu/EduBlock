import {Inject, Service, Token} from "typedi";
import {BasicApi} from "../basic.api";
import express from "express";
import {FilesService, FilesServiceToken} from "../../services/common/files.service";
import asyncHandler from "express-async-handler";
import multer from "multer";
import {EduFileDto} from "../../dto/common/edu-file.dto";
import {createInvalidRequestParamsError} from "../../errors/edu.error.factory";

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
        this.router.post('/files', this.multerMiddleware.single('file'), asyncHandler(
            async (req, res) => this.handleUploadFile(req, res)));
        this.router.get('/files/:hashId', asyncHandler(
            async (req, res) => this.getFile(req, res)));
    }

    private async handleUploadFile(req, res) {
        const dto: EduFileDto = req.file;
        if (!dto) {
            throw createInvalidRequestParamsError('dto');
        }
        const savedFile = await this.filesService.saveFile(dto);
        res.contentType(savedFile.mimeType);
        res.send(savedFile.content);
    }


    private async getFile(req, res) {
        const hashId: string = req.params.hashId;
        if (!hashId) {
            throw createInvalidRequestParamsError('hashId');
        }
        const foundFile = await this.filesService.getFile(hashId);
        res.contentType(foundFile.mimeType);
        res.send(foundFile.content);
    }
}
