# Message Broker

A simple message broker example using BullMQ and Redis (worker / queue). Producers publish messages to the queue. Consumers manually get one unread message from the queue through a worker, in order as FIFO (one at a time).

## Setup
1. Install [Docker](https://www.docker.com/)
2. Build and start services:
```bash
$ docker-compose up --build
```

## Running Producers & Consumers
Create node image:
```bash
$ docker build --tag node-docker . 
```
Run Producers:
```bash
docker run -it -v $(pwd)/.:/var/www/app --network bridge node-docker npm i && npm run start:producers
```

Run consumers
```bash
docker run -it -v $(pwd)/.:/var/www/app --network bridge node-docker npm i && npm run start:consumers 
```

## API Doc

**Publish Message**
```bash
curl -XPOST -H "Content-type: application/json" -d '{
  "payload": { "message": "Hello World" }
}' 'http://localhost:3000/v1/message'
```

**Read One Unread Message At A Time In Order**
```bash
curl -XGET 'http://localhost:3000/v1/message'
```

## Running Integration Tests
1. Spin up a redis instance
```bash
$ docker run --name redis-test -p 6380:6379 -d redis
```
2. Change the .env file to reflect the redis host and port eg.
```bash
REDIS_URL=127.0.0.1
REDIS_PORT=6380
PORT=4000
```
3. Create node-docker **if it doesn't** exist
```bash
$ docker build --tag node-docker . 
```
4. Run test:
```bash
docker run -it -v $(pwd)/.:/var/www/app --network bridge node-docker npm i && npm run test
``` 

## Explanation
Two common patterns that did not fit all the requirements but are typically used in real-world cases:
1. **Queue / Worker** - mostly used for decoupling. Worker could have acted as a consumer that processes jobs automatically but the requirements asked for a read messages api endpoint which wouldn't fit this use-case. This pattern satisfies "Bonus: Implement at-most-once delivery. This means that when a consumer reads a message, the system will guarantee that no other consumers read the message. Think about reliability especially in this case."

2. **Pub/Sub** - Also used for decoupling and may other use-cases. Uses a queue but messages typically are sent to one or more clients that are subscribed to a channel or topic and are not sent in any order. It did not satisfy the "This means that when a consumer reads a message, the system will guarantee that no other consumers read the message. Think about reliability especially in this case" (a difficult problem to solve in pub/sub). Pub/Sub typically guarantees that each subscribed client / consumer should receive the message at most once. 

BullMQ already handles the "At-most-once delivery". Once a job is selected, it status changes to active and so no other consumer can get / read that job. 

## Dependencies
1. "axios": "^0.26.1" - to make http requests

2. "bullmq": "^1.78.2" - to use the queue and worker

3. "dotenv": "^16.0.0" - to load environment variables from .env file

4. "express": "^4.17.3" - a popular web framework that I've mostly used before

5. "helmet": "^5.0.2" - a set of security middleware that I mostly used before

6. "nodemon": "^2.0.15" - monitoring tool for development

7. "ts-node": "^10.7.0" - transpile ts to js and runs the file. Used to run consumers.ts and producers.ts

8. "txtgen": "^3.0.1" - a simple npm package to randomly generate sentences to send a message from the producers.

9. "typescript": "^4.6.3" - provide typings and type checking to javascript

10. "uuid": "^8.3.2" - to generate random ids for jobs

11. jest - a testing framework with a set of assertion methods.

12. supertest - to make requests to a server for integration testing

13. prettier / eslint - for linting