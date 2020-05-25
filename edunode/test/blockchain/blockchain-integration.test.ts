import 'mocha';
import {buildRequest, closeTestServer, getAuthToken, seed, startTestServer} from '../integration-test.utils';
import chai from 'chai';
import {CreateTransactionDto} from '../../app/common/dto/common/create-transaction.dto';

const expect = chai.expect;

describe('Blockchain Integration Tests', function () {
    // @ts-ignore
    this.timeout(50000);
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

    it('Should be able to add a new transaction and get it back', async function () {
        const agent = buildRequest();
        const dto = {
            studentPublicKey: 'some-public-key',
            title: 'Some Notes',
            attachments: [],
        } as CreateTransactionDto;

        const req = await agent.post('/api/blockchain/transactions').set('authorization', 'Bearer ' + authToken).send(dto);
        verifyTransaction(req, dto);
        const transactionHash = req.body.hash;
        const reqGet = await agent.get('/api/blockchain/transactions/' + transactionHash).set('authorization', 'Bearer ' + authToken).send();
        verifyTransaction(reqGet, dto);
    });

    it('Should not be able to add a new invalid transaction', async function () {
        const agent = buildRequest();
        const dto = {
            studentPublicKey: '',
            title: '',
            attachments: [],
        } as CreateTransactionDto;

        const req = await agent.post('/api/blockchain/transactions').set('authorization', 'Bearer ' + authToken).send(dto);
        expect(req).to.not.have.status(200);
    });

    it('Should be able to get all transactions', async function () {
        const agent = buildRequest();
        const dto = {
            studentPublicKey: 'some-public-key',
            title: 'Some Notes',
            attachments: [],
        } as CreateTransactionDto;

        const req = await agent.post('/api/blockchain/transactions').set('authorization', 'Bearer ' + authToken).send(dto);
        verifyTransaction(req, dto);
        const reqGet = await agent.get('/api/blockchain/transactions').set('authorization', 'Bearer ' + authToken).send();
        expect(reqGet).to.have.status(200);
        expect(reqGet.body).to.exist;
        expect(reqGet.body.length).to.be.gte(1);
    });

    it('Should be able to initiate manual block creation', async function () {
        const agent = buildRequest();
        const dto = {
            studentPublicKey: 'some-public-key',
            title: 'Some Notes',
            attachments: [],
        } as CreateTransactionDto;
        const req = await agent.post('/api/blockchain/transactions').set('authorization', 'Bearer ' + authToken).send(dto);
        verifyTransaction(req, dto);

        const reqCreateBlock = await agent.post('/api/blockchain').set('authorization', 'Bearer ' + authToken).send();
        expect(reqCreateBlock).to.have.status(200);
    });

    it('Should not be able to initiate manual block creation when you do not have transactions', async function () {
        const agent = buildRequest();
        const reqCreateBlock = await agent.post('/api/blockchain').set('authorization', 'Bearer ' + authToken).send();
        expect(reqCreateBlock).to.not.have.status(200);
    });
});

function verifyTransaction(req, dto) {
    expect(req).to.have.status(200);
    expect(req.body).to.exist;
    expect(req.body.title).to.equal(dto.title);
    expect(req.body.targetPublicKey).to.equal(dto.studentPublicKey);
    expect(req.body.attachments).to.exist;
    expect(req.body.attachments.length).to.equal(dto.attachments.length);
    expect(req.body.version).to.exist;
    expect(req.body.creatorPublicKey).to.exist;
    expect(req.body.creatorSignature).to.exist;
    expect(req.body.status).to.exist;
    expect(req.body.hash).to.exist;
    expect(req.body.certificateAuthorityPublicKey).to.exist;
    expect(req.body.certificateSignature).to.exist;
    expect(req.body.creationDate).to.exist;
    expect(req.body.id).to.exist;
}
