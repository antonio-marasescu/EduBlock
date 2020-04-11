import {DIInterface} from "../di.interface";
import {Container} from "typedi";
import {RABBIT_MQ_CONFIG} from "../../../network/rabbitmq/rabbit-mq.config";
import {RabbitMqServiceToken} from "../../../network/rabbitmq/rabbit-mq.service.interface";
import {RabbitMqService} from "../../../network/rabbitmq/rabbit-mq.service";
import {PingPublisher} from "../../../network/rabbitmq/publishers/ping.publisher";
import {API_REGISTER} from "../../../network/api/basic.api.register";

export class NetworkDi implements DIInterface {
    inject(_: any): void {
        Container.set('rabbitmq.config', RABBIT_MQ_CONFIG);
        Container.set(RabbitMqServiceToken, new RabbitMqService(Container.get('rabbitmq.config')));
        Container.set('publishers.ping', new PingPublisher(Container.get(RabbitMqServiceToken)));
        API_REGISTER.forEach(dict => Container.set(dict.token, dict.instance));
    }

}
