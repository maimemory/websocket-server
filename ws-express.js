import express from 'express';
const app = express();
import { createServer } from 'http';
const server = createServer(app);
import WebSocket, { WebSocketServer } from 'ws';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const wss = new WebSocketServer({
    server: server
})

wss.on('connection', ws => {
    // console.log(ws);
    ws.on('error', console.error);
    
    ws.on('message', msg => {
        console.log('Receive message: %s', msg);
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(msg.toString());
            }
        });
    });
  
    console.log((new Date()) + ' Connection accepted. A new client connected!');
    ws.send('Welcome new client!');

    ws.on('close', () => {
        console.log('Client disconnected!')
    })
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/dashboard.html");
})

server.listen(8000, () => {
    console.log('Server is listening on port 8000');
})