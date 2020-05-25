import 'mocha';
import {buildRequest, closeTestServer, getAuthToken, seed, startTestServer} from '../integration-test.utils';
import chai from 'chai';
import {EduStudentDto} from '../../app/common/dto/common/edu-student.dto';

const expect = chai.expect;

describe('Students Integration Tests', function () {
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

    it('Should be able to add a new student and get it back', async function () {
        const agent = buildRequest();
        const dto = {
            publicKey: 'some-public-key',
            fullName: 'Some Student',
            groupId: '30441',
            faculty: 'Faculty of Testing'
        } as EduStudentDto;

        const req = await agent.post('/api/students').set('authorization', 'Bearer ' + authToken).send(dto);
        expect(req).to.have.status(200);
        expect(req.body).to.exist;
        expect(req.body.publicKey).to.equal(dto.publicKey);
        expect(req.body.fullName).to.equal(dto.fullName);
        expect(req.body.groupId).to.equal(dto.groupId);
        expect(req.body.faculty).to.equal(dto.faculty);

        const reqGet = await agent.get('/api/students').set('authorization', 'Bearer ' + authToken).send();
        expect(reqGet).to.have.status(200);
        expect(reqGet.body).to.exist;
        expect(reqGet.body.length).to.gte(1);
    });

    it('Should not be able to add a new invalid student', async function () {
        const agent = buildRequest();
        const dto = {
            publicKey: '',
            fullName: '',
            groupId: '',
            faculty: ''
        } as EduStudentDto;

        const req = await agent.post('/api/students').set('authorization', 'Bearer ' + authToken).send(dto);
        expect(req).to.not.have.status(200);
    });
});
