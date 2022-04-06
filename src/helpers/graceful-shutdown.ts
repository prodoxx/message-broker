import { Server } from 'http';
import { Queue, Worker } from 'bullmq';

export const gracefulShutdown = async (server: Server, queue: Queue, worker: Worker) => {
    try {
        await worker.close();
        await queue.pause();
        server.close(() => {
            console.log('-----Closed Server!-----');
        });
    } catch (err) {
        console.log('Unable to shut down sever because: ', err);
    }
};
