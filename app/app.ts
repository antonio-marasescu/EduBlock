import "reflect-metadata";
import {Container, Inject, Service} from "typedi";
import {EduNode, EduNodeToken} from "./common/server/edu.node";
import DIExecutor from "./common/di/di.executor";
import {IdentityReader} from "./common/config/arguments/identity.reader";

@Service()
class App {
    constructor(@Inject(EduNodeToken) private eduNode: EduNode) {
    }

    public async start(): Promise<void> {
        await this.eduNode.initialize();
    }
}

const argumentHandler = new IdentityReader();
argumentHandler.readArguments();
const di = new DIExecutor();
di.execute(null);

const app = Container.get(App);
app.start().then(async () => {
    // const rabbitService: IRabbitMqService = Container.get(RabbitMqServiceToken);
    // const identity = Math.random() * 100;
    // await rabbitService.createQueue('test-queue' + identity);
    // rabbitService.bindConsumerToQueue('test-queue' + identity, new PingConsumer);
    // const publisher: PingPublisher = Container.get('publishers.ping');
    // await publisher.publish('Hello world!');
});