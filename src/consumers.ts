import axios from 'axios';

const createConsumer = (id: number, intervalInMilliSeconds: number): void => {
    setInterval(async () => {
        const res = await axios.get('http://127.0.0.1:3000/v1/message');
        console.log(`Consumer ${id} Request Response: `, {
            response: JSON.stringify(res.data)
        });
    }, intervalInMilliSeconds);
};

// create 5 consumers with varying request intervals
for (let i = 0; i < 5; i++) {
    const interval = Math.floor(Math.random() * (20000 - 3000 + 1) + 3000);
    createConsumer(i + 1, interval);
}
