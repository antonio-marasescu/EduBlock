import 'mocha';
import DIExecutor from '../app/di/di.executor';
import {Container} from 'typedi';
import {App} from '../app/app.service';
import {InitParamModel} from '../app/di/initialization/init-param.model';
import {EduNodeToken} from '../app/server/edu.node';
// @ts-ignore
import chaiHttp, {ChaiHttp} from 'chai-http';
import chai from 'chai';
import {NodeConfigurationModelToken} from '../app/common/config/node-configuration.model';

const expect = chai.expect;
chai.use(chaiHttp);

export const TestServerStartDelay = 2000;

export function buildRequest(): ChaiHttp.Agent {
    const configuration = Container.get(NodeConfigurationModelToken);
    const port = configuration.identity.port;
    const host = configuration.identity.host;
    return chai.request(host + ':' + port);
}

export async function startTestServer(done): Promise<void> {
    const initData = {
        init: {
            identity: 'node-uni-tests',
            isRunningTests: true
        } as InitParamModel
    };
    const di = new DIExecutor();
    await di.initialize(initData);
    const app = Container.get(App);
    await app.start();
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, TestServerStartDelay)
    });
    done();
}

export async function closeTestServer(done): Promise<void> {
    await seed();
    const eduNode = Container.get(EduNodeToken);
    await eduNode.killServer(done);
}

export async function seed() {
    const agent = buildRequest();
    const request = await agent.get('/api/seed');
    expect(request).to.have.status(200);
}

export async function getAuthToken(): Promise<string> {
    const agent = buildRequest();
    const user = {
        email: 'admin@email.com',
        password: 'admin'
    };
    const request = await agent.post('/api/login').send(user);
    expect(request).to.have.status(200);
    expect(request).to.have.header('authorization');
    return request.header['authorization'];
}
