export interface RabbitMqConfig {
    url: string;
    exchangeName: string;
}

export const RABBIT_MQ_CONFIG: RabbitMqConfig = {
    url: 'amqp://localhost',
    exchangeName: 'edu-node-common-exchange'
};
