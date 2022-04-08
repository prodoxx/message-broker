import { Worker, Job } from 'bullmq';
import { queueName } from '../queues/message-broker.queue';

// no specified job handler because API request will only get the next job and handle it.
const messageBrokerWorker = new Worker(queueName, undefined, {
    autorun: false,
    connection: {
        host: process.env.REDIS_URL,
        port: parseInt(process.env.REDIS_PORT || '10')
    }
});

// set event handlers
messageBrokerWorker.on('progress', (job: Job) => {
    console.log(`Message Broker Worker is processing job id: ${job.id}`);
});

messageBrokerWorker.on('completed', (job: Job) => {
    console.log(`Message Broker Worker finished processing job id: ${job.id}`);
});

export default messageBrokerWorker;
