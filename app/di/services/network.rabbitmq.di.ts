import {DIInterface} from "../di.interface";
import {Container} from "typedi";
import {RABBIT_MQ_CONFIG} from "../../common/network/rabbitmq/rabbit-mq.config";

export class NetworkRabbitMQDi implements DIInterface {
    inject(_: any): void {
        Container.set('rabbitmq.config', RABBIT_MQ_CONFIG);
    }

}
