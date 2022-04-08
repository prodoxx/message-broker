import { Request, Response } from 'express';
import { createResponse } from '../libs/create-response';
import { v4 as uuid4 } from 'uuid';
import { Job } from 'bullmq';
import { messageBrokerQueue } from '../queues';
import { messageBrokerWorker } from '../workers';

export const sendMessage = (req: Request, res: Response): Response<any, Record<string, any>> => {
    try {
        const data = req.body;
        const id = uuid4();

        // make sure the client submitted a payload attribute
        if (!data?.payload) {
            createResponse(400, {}, { message: 'Missing payload attribute.' });
        }

        // asynchronously add payload to queue
        messageBrokerQueue.add(id, data.payload);

        const payload = { id };
        const response = createResponse(200, payload, {});
        return res.status(200).json(response);
    } catch (error) {
        const errorResult = createResponse(500, {}, { message: 'Something went wrong.' });
        return res.status(500).json(errorResult);
    }
};

export const readMessage = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
    try {
        const token = uuid4();
        const job = (await messageBrokerWorker.getNextJob(token)) as Job;
        const data = job?.data || {};
        const payload = { data };

        const response = createResponse(200, payload, {});
        return res.status(200).json(response);
    } catch (error) {
        const errorResult = createResponse(500, {}, { message: 'Something went wrong.' });
        return res.status(500).json(errorResult);
    }
};
