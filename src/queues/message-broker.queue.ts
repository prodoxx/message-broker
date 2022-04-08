import { Queue } from 'bullmq';

export const queueName = 'message-broker';

export const messageBrokerQueue = new Queue(queueName, {
    connection: {
        host: process.env.REDIS_URL,
        port: parseInt(process.env.REDIS_PORT || '10')
    }
});
