import 'mocha';
import {buildRequest, closeTestServer, getAuthToken, seed, startTestServer} from '../integration-test.utils';
import chai from 'chai';
import {EduUserDto} from '../../app/common/dto/common/edu-user.dto';
import {EduUserRoles} from '../../app/common/entities/university/edu-user.entity';

const expect = chai.expect;

describe('Authentication Integration Tests', function () {
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

    it('Should have an authorization token', async function () {
        expect(authToken).to.exist;
    });


    it('Should have an authorization token', async function () {
        const agent = buildRequest();
        const req = await agent.get('/api/users/me').set('authorization', 'Bearer ' + authToken).send();
        expect(req).to.have.status(200);
        const user: EduUserDto = req.body;
        expect(user.email).to.equal('admin@email.com');
        expect(user.role).to.equal(EduUserRoles.ADMIN);
    });

    it('Should be able to register a new user and be able to login with it', async function () {
        const agent = buildRequest();

        const newUser = new EduUserDto();
        newUser.email = 'test@email.com';
        newUser.password = 'test';

        const req = await agent.post('/api/register').send(newUser);
        expect(req).to.have.status(200);
        const user: EduUserDto = req.body;
        expect(user.id).to.exist;
        expect(user.email).to.equal('test@email.com');
        expect(user.role).to.equal(EduUserRoles.USER);

        const request = await agent.post('/api/login').send(newUser);
        expect(request).to.have.status(200);
        expect(request).to.have.header('authorization');
    });

    it('Should not be able to register a new user with empty credentials', async function () {
        const agent = buildRequest();

        const newUser = new EduUserDto();
        newUser.email = '';
        newUser.password = '';

        const req = await agent.post('/api/register').send(newUser);
        expect(req).to.not.have.status(200);
    });

    it('Should not be able to login with invalid credentials', async function () {
        const agent = buildRequest();
        const newUser = new EduUserDto();
        newUser.email = 'invalid@email.com';
        newUser.password = 'invalid';
        const request = await agent.post('/api/login').send(newUser);
        expect(request).to.not.have.status(200);
        expect(request).to.not.have.header('authorization');
    })
});
