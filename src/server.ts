// load .env file
import 'dotenv/config';
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { messageBrokerQueue } from './queues';
import { messageBrokerWorker } from './workers';
import { Server } from 'http';
import { gracefulShutdown } from './helpers/graceful-shutdown';

require('dotenv').config();

export const app: Application = express();

// middleware
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// security
app.use(helmet());

// set entry route for api
app.use('/v1', require('./routes'));

export let httpServer: Server;
const PORT = process.env.PORT || 3000;

// start the queue before starting the server.
messageBrokerQueue.resume().then(() => {
    // start live server
    httpServer = app.listen(PORT, () => {
        console.log('MessageBroker API is running at port %d in %s mode', PORT, app.get('env'));
        console.log('Press CTRL-C to stop\n');
    });
});

// handle services shutdown gracefully
process.on('SIGTERM', () => gracefulShutdown(httpServer, messageBrokerQueue, messageBrokerWorker));
process.on('SIGINT', () => gracefulShutdown(httpServer, messageBrokerQueue, messageBrokerWorker));
