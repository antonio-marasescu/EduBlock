import {DIInterface} from "../di.interface";
import {Container} from "typedi";
import {RABBIT_MQ_CONFIG} from "../../../network/rabbitmq/rabbit-mq.config";
import {RabbitMqServiceToken} from "../../../network/rabbitmq/rabbit-mq.service.interface";
import {RabbitMqService} from "../../../network/rabbitmq/rabbit-mq.service";
import {PingPublisher} from "../../../network/rabbitmq/publishers/ping.publisher";

export class NetworkDi implements DIInterface {
    inject(_: any): void {
        Container.set('rabbitmq.config', RABBIT_MQ_CONFIG);
        Container.set(RabbitMqServiceToken, new RabbitMqService(Container.get('rabbitmq.config')));
        Container.set('publishers.ping', new PingPublisher(Container.get(RabbitMqServiceToken)));
    }

}
