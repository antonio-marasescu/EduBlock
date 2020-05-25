import 'mocha';
import {buildRequest, closeTestServer, getAuthToken, seed, startTestServer} from '../integration-test.utils';
import chai from 'chai';

const expect = chai.expect;

describe('Files Integration Tests', function () {
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

    it('Should be able to add a file and get it back', async function () {
        const agent = buildRequest();
        const transactionHash = 'testhash';
        const filename = 'integration-file.txt';
        const req = await agent.post('/api/files')
            .set('authorization', 'Bearer ' + authToken)
            .set('Content-Type', 'application/multipart')
            .attach('file', './test/resources/' + filename, filename);
        expect(req).to.have.status(200);
        expect(req.body).to.exist;
        expect(req.body.filename).to.equal(filename);
        expect(req.body.ownerPublicKey).to.exist;
        expect(req.body.version).to.exist;
        expect(req.body.hash).to.exist;
        const fileHash = req.body.hash;
        const reqGetFile = await agent.get('/api/files/' + transactionHash + '/' + fileHash)
            .set('authorization', 'Bearer ' + authToken).send();
        expect(reqGetFile.body).to.exist;
        expect(reqGetFile.body.hash).to.equal(fileHash);
        expect(reqGetFile.body.filename).to.equal(filename);
        expect(reqGetFile.body.ownerPublicKey).to.exist;
        expect(reqGetFile.body.content).to.exist;
    });

    it('Should not able to find a non-existent file', async function () {
        const agent = buildRequest();
        const reqGetFile = await agent.get('/api/files/' + 1 + '/' + 1)
            .set('authorization', 'Bearer ' + authToken).send();
        expect(reqGetFile).to.not.have.status(200);
    });

    it('Should not be able to upload a non-existent file', async function () {
        const agent = buildRequest();
        const filename = 'integration-file.txt';
        const req = await agent.post('/api/files')
            .set('authorization', 'Bearer ' + authToken)
            .set('Content-Type', 'application/multipart')
            .send(filename);
        expect(req).to.not.have.status(200);
    });
});

