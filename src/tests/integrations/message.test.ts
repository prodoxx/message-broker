import 'dotenv/config';
import { messageBrokerQueue } from '../../queues';
import { messageBrokerWorker } from '../../workers';
import request from 'supertest';

import { app, httpServer } from '../../server';

// disable all console methods except for debug
for (const method of ['log', 'info', 'warn', 'error']) {
    jest.spyOn(global.console, <any>method).mockImplementation(() => {});
}

describe('Message', () => {
    beforeEach(async () => {
        // remove everything from the queue
        await messageBrokerQueue.obliterate({ force: true });
    });

    afterAll(async () => {
        await messageBrokerWorker.close();
        await messageBrokerQueue.close();
        httpServer.close();
    });

    it('HAPPY: should publish a message successfully', async () => {
        const message = 'Hello World';
        const payload = { message };
        const { body } = await request(app).post('/v1/message').send({ payload }).expect(200);

        expect(body.data).toHaveProperty('id');
    });

    it('SAD: should return bad request if payload property not included in request', async () => {
        const { body } = await request(app).post('/v1/message').send({}).expect(400);

        expect(body.response.errors).toStrictEqual({
            message: 'Missing payload attribute.'
        });
    });

    it('HAPPY: should get an unread message from the broker', async () => {
        const message = 'Hey you!';
        await request(app).post('/v1/message').send({ payload: { message } }).expect(200);

        const { body } = await request(app).get('/v1/message').expect(200);
        expect(body.data).toHaveProperty('id');
        expect(body.data).toHaveProperty('message');

        expect(body.data.message).toBe(message);
    });

    it('HAPPY: should return an empty object when there is no unread message', async () => {
        const { body } = await request(app).get('/v1/message').expect(200);

        expect(body.data).toBeUndefined();
    });
});
