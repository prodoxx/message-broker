import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';

import { gracefulShutdown } from './helpers/graceful-shutdown';

const expressServer = express();

// middleware
expressServer.use(bodyParser.json({ limit: '2mb' }));
expressServer.use(bodyParser.urlencoded({ extended: true }));

// security
expressServer.use(helmet());

// set entry route for api
expressServer.use('/v1', require('./routes'));

// start expressServer
const httpServer = expressServer.listen(expressServer.get('port'), () => {
    console.log('expressServer is running at port %d in %s mode', expressServer.get('port'), expressServer.get('env'));
    console.log('Press CTRL-C to stop\n');
});

// handle shutdown gracefully
process.on('SIGTERM', () => gracefulShutdown(httpServer, null, null));
process.on('SIGINT', () => gracefulShutdown(httpServer, null, null));
