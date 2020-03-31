const express = require('express');
const expressWs = require('express-ws');
const cors = require('cors');

const nanoid = require('nanoid');

const app = express();
const port = 8000;

expressWs(app);

app.use(express.json());
app.use(cors());

const users = [];

const canvas = [];

app.ws('/canvas', function (ws) {
    const id = nanoid();

    users[id] = ws;

    console.log('Connect');

    ws.on('message', (m) => {
        const data = JSON.parse(m);

        if(data.type === 'GET_ALL'){
            canvas.forEach(e => {
                ws.send(e);
            })
        }
        if(data.type === 'ADD_CIRCLE'){
            canvas.push(m);
            Object.keys(users).forEach(user => {
                users[user].send(m);
            });
        }
    });

    ws.on('close', () => {
        console.log('Disconnect');
        delete users[id];
    })
});

app.listen(port, () => {
    console.log(`Server started on ${port} port!`)
});