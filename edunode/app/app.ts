import "reflect-metadata";
import {Container} from "typedi";
import DIExecutor from "./di/di.executor";
import {App} from "./app.service";

const di = new DIExecutor();
di.initialize(null).then(async () => {
    const app = Container.get(App);
    app.start().then(async () => {
        // const rabbitService: IRabbitMqService = Container.get(RabbitMqServiceToken);
        // const identity = Math.random() * 100;
        // await rabbitService.createQueue('test-queue' + identity);
        // rabbitService.bindConsumerToQueue('test-queue' + identity, new PingConsumer);
        // const publisher: PingPublisher = Container.get('publishers.ping');
        // await publisher.publish('Hello world!');
    });
});
