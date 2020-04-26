import {Inject, Service, Token} from "typedi";
import {
    CertificateAuthorityService,
    CertificateAuthorityServiceToken
} from "../../services/certificate-authority.service";
import asyncHandler from 'express-async-handler';
import express from "express";
import {SignatureDto} from "../../dto/signature.dto";
import {IdentityService, IdentityServiceToken} from "../../services/identity.service";

export const CertificateAuthorityApiToken = new Token<CertificateAuthorityApi>('network.api.certificate-authority');

@Service(CertificateAuthorityApiToken)
export class CertificateAuthorityApi {
    private readonly router: express.Router;

    constructor(
        @Inject(CertificateAuthorityServiceToken) private certificateAuthorityService: CertificateAuthorityService,
        @Inject(IdentityServiceToken) private identityService: IdentityService,
    ) {
        this.router = express.Router();
        this.registerRoutes();
    }

    public getRouter(): express.Router {
        return this.router;
    }

    private registerRoutes() {
        this.router.get('/ca/healthcheck',
            asyncHandler(async (_, res) => res.json(await this.identityService.getPersonalInformation())));
        this.router.post('/ca/sign',
            asyncHandler(async (req, res) => this.signDataHandler(req, res)));
    }

    private async signDataHandler(req, res) {
        const signatureDto: SignatureDto = await this.certificateAuthorityService.signData(req.body);
        res.json(signatureDto)
    }
}
