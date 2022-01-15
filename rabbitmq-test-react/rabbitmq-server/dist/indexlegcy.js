"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connection_1 = __importDefault(require("./connection"));
var bodyParser = require('body-parser');
var app = (0, express_1.default)();
var router = express_1.default.Router();
var server = require('http').Server(app);
var socketIO = require('socket.io')(server);
var calcSocket = socketIO.of('/calc');
(0, connection_1.default)((connection) => {
    connection.createChannel((err, channel) => {
        if (err) {
            throw new Error(err);
        }
        var mainQueue = 'main';
        channel.assertQueue(mainQueue, { exclusive: true }, (err, queue) => {
            if (err) {
                throw new Error(err);
            }
            channel.bindQueue(queue.queue, mainQueue, '');
            channel.consume(queue.que, (msg) => {
                var result = JSON.stringify({
                    result: Object.values(JSON.parse(msg.content.toString())
                        .task)
                        .reduce((accumulator, currentValue) => parseInt(accumulator) + parseInt(currentValue))
                });
                calcSocket.emit('/calc', result);
            });
        }, { noAck: true });
    });
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', router);
router.route('/calc/sum').post((req, res) => {
    (0, connection_1.default)((connection) => {
        connection.createChannel((err, channel) => {
            if (err) {
                throw new Error(err);
            }
            var ex = 'main';
            var msg = JSON.stringify({ task: req.body });
            channel.publish(ex, '', Buffer.from(msg), { persistent: false });
            channel.close(() => { connection.close(); });
        });
    });
});
server.listen(5555, '0.0.0.0', () => {
    console.log('Running at at localhost:5555');
});
