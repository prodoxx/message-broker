import { Worker } from 'bullmq';
import { queueName } from '../queues/message-broker.queue';

// no specified job handler because API request will only get the next job and handle it.
const messageBrokerWorker = new Worker(queueName, undefined, {
    autorun: false,
    connection: {
        host: process.env.REDIS_URL,
        port: parseInt(process.env.REDIS_PORT || '10')
    }
});

export default messageBrokerWorker;
