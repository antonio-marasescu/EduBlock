import 'mocha';
import {buildRequest, closeTestServer, getAuthToken, seed, startTestServer} from '../integration-test.utils';
import chai from 'chai';
import {Container} from 'typedi';
import {NodeConfigurationModelToken} from '../../app/common/config/node-configuration.model';
import {EduNewNetworkMemberDto} from '../../app/common/dto/network/edu-new-network-member.dto';
// @ts-ignore

const expect = chai.expect;
const nmsServer = 'localhost:3005';

describe('Network Members Integration Tests', function () {
    // @ts-ignore
    this.timeout(50000);
    // @ts-ignore
    let authToken: string;

    before(function (done) {
        startTestServer(done);
    });

    after(function (done) {
        closeTestServer(done);
    });

    beforeEach(async function () {
        await seed();
        authToken = await getAuthToken();
    });

    afterEach(async function () {
        const req = await chai.request(nmsServer).get('/api/seed').send();
        expect(req).to.have.status(200);
    });

    it('Should get university network identity', async function () {
        const agent = buildRequest();
        const req = await agent.get('/api/network/identity/me').set('authorization', 'Bearer ' + authToken).send();
        const config = Container.get(NodeConfigurationModelToken);
        expect(req).to.have.status(200);
        expect(req.body).to.exist;
        expect(req.body.id).to.exist;
        expect(req.body.publicKey).to.exist;
        expect(req.body.legalIdentity).equal(config.identity.legalName);
    });

    it('Should get network members', async function () {
        const agent = buildRequest();
        const req = await agent.get('/api/network/members').set('authorization', 'Bearer ' + authToken).send();
        expect(req).to.have.status(200);
        expect(req.body).to.exist;
        expect(req.body.length).to.be.greaterThan(1);
    });

    it('Should learn network members', async function () {
        const agent = buildRequest();
        const req = await agent.get('/api/network/learn').set('authorization', 'Bearer ' + authToken).send();
        expect(req).to.have.status(200);
        expect(req.body).to.exist;
        expect(req.body.length).to.be.greaterThan(1);
    });

    it('Should be able to add a new network member', async function () {
        const agent = buildRequest();
        const dto = {
            publicKey: 'test',
            legalIdentity: 'University of Testing',
            host: 'localhost',
            port: 4242
        } as EduNewNetworkMemberDto;
        const req = await agent.post('/api/network/members').set('authorization', 'Bearer ' + authToken).send(dto);
        expect(req).to.have.status(200);
        expect(req.body).to.exist;
        expect(req.body.publicKey).to.equal(dto.publicKey);
        expect(req.body.legalIdentity).to.equal(dto.legalIdentity);
        expect(req.body.host).to.equal(dto.host);
        expect(req.body.port).to.equal(dto.port);
    });

    it('Should not be able to add an invalid network member', async function () {
        const agent = buildRequest();
        const dto = {
            publicKey: '',
            legalIdentity: '',
            host: '',
            port: 4242
        } as EduNewNetworkMemberDto;
        const req = await agent.post('/api/network/members').set('authorization', 'Bearer ' + authToken).send(dto);
        expect(req).to.not.have.status(200);
    });
});
