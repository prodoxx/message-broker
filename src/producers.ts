import axios from 'axios';
import { sentence } from 'txtgen';

const createProducer = (id: number, intervalInMilliSeconds: number): void => {
    setInterval(async () => {
        const payload = { producerId: id, message: sentence() };
        const res = await axios.post('http://127.0.0.1:3000/v1/message', {
            payload
        });
        console.log(`Producer ${id}: `, {
            payload,
            response: JSON.stringify(res.data)
        });
    }, intervalInMilliSeconds);
};

// create 2 producers with varying request intervals
for (let i = 0; i < 2; i++) {
    const interval = Math.floor(Math.random() * (20000 - 3000 + 1) + 3000);
    createProducer(i + 1, interval);
}
