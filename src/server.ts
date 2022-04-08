// load .env file
require('dotenv').config();

import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { messageBrokerQueue } from './queues';
import { messageBrokerWorker } from './workers';
import { Server } from 'http';
import { gracefulShutdown } from './helpers/graceful-shutdown';

const expressServer = express();

// middleware
expressServer.use(bodyParser.json({ limit: '2mb' }));
expressServer.use(bodyParser.urlencoded({ extended: true }));

// security
expressServer.use(helmet());

// set entry route for api
expressServer.use('/v1', require('./routes'));

let httpServer: Server;
const PORT = process.env.PORT || 3000;

// start the queue before starting the server.
messageBrokerQueue.resume().then(() => {
    // start live server
    httpServer = expressServer.listen(PORT, () => {
        console.log('MessageBroker API is running at port %d in %s mode', PORT, expressServer.get('env'));
        console.log('Press CTRL-C to stop\n');
    });
});

// handle services shutdown gracefully
process.on('SIGTERM', () => gracefulShutdown(httpServer, messageBrokerQueue, messageBrokerWorker));
process.on('SIGINT', () => gracefulShutdown(httpServer, messageBrokerQueue, messageBrokerWorker));
