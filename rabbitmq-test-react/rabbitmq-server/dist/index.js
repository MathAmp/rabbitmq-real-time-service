"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connection_1 = __importDefault(require("./connection"));
const cors = require('cors');
var bodyParser = require('body-parser');
var app = (0, express_1.default)();
var router = express_1.default.Router();
var server = require('http').createServer(app);
var socketIO = require('socket.io')(server, { cors: { origin: '*' } });
var calcSocket = socketIO.of('calc');
(0, connection_1.default)((connection) => {
    // connection.createChannel(function(error1, channel) {
    //       if (error1) {
    //         throw error1;
    //       }
    //       var i = 0
    //       var exchange = 'logs';
    //       var msg = process.argv.slice(2).join(' ') || `Hel ${i} World!`;
    //       channel.assertExchange(exchange, 'fanout', {
    //         durable: false
    //       });
    //       channel.publish( exchange, '', Buffer.from(msg) );
    //       console.log(" [x] Sent %s", msg);
    //       var intervalID = setInterval(() => {
    //         i += 1;
    //         var msg = process.argv.slice(2).join(' ') || `Hel ${i} World!`;
    //         channel.publish( exchange, '', Buffer.from(msg) );
    //         console.log(`[${i}] Send: ${msg}`);
    //       }, 1000);
    //     });
    connection.createChannel((err, channel) => {
        if (err) {
            throw new Error(err);
        }
        var exchange = 'logs';
        var mainQueue = 'main';
        var mainQueueTest = 'main.test';
        var msg = process.argv.slice(2).join('') || 'hello world';
        channel.assertQueue(mainQueueTest, { exclusive: true }, (err, queue) => {
            if (err) {
                throw new Error(err);
            }
            console.log(queue);
            channel.bindQueue(queue.queue, mainQueue, '');
            channel.consume(queue.queue, (msg) => {
                var result = JSON.stringify({
                    result: Object.values(JSON.parse(msg.content.toString())
                        .task)
                        .reduce((accumulator, currentValue) => parseInt(accumulator) + parseInt(currentValue))
                });
                calcSocket.emit('calc', result);
                console.log(result);
            }), {
                noAck: true
            };
        });
    });
});
router.route('/calc/sum').post((req, res) => {
    (0, connection_1.default)((connection) => {
        connection.createChannel((err, channel) => {
            if (err) {
                throw new Error(err);
            }
            var mainQueue = 'main';
            var mainQueueTest = 'main.test';
            var msg = JSON.stringify({ task: req.body });
            // post로 받아온 메세지 mainQueue로 발행
            channel.publish(mainQueue, mainQueueTest, Buffer.from(msg), { persistent: false });
            channel.close(() => { connection.close(); });
        });
        res.end();
    });
});
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', router);
server.listen(5555, 'localhost', () => {
    console.log('Running at at localhost:5555');
});
// //amqp://admin:admin@localhost admin:admin = rabbitmq 계정:암호
// amqp.connect('amqp://guest:guest@127.0.0.1:5672', function(error0: any, connection: Connection) {
//   if (error0) {
//     throw error0;
//   }
//   connection.createChannel(function(error1, channel) {
//     if (error1) {
//       throw error1;
//     }
//     var i = 0
//     var exchange = 'logs';
//     var msg = process.argv.slice(2).join(' ') || `Hel ${i} World!`;
//     channel.assertExchange(exchange, 'fanout', {
//       durable: false
//     });
//     channel.publish( exchange, '', Buffer.from(msg) );
//     console.log(" [x] Sent %s", msg);
//     var intervalID = setInterval(() => {
//       i += 1;
//       var msg = process.argv.slice(2).join(' ') || `Hel ${i} World!`;
//       channel.publish( exchange, '', Buffer.from(msg) );
//       console.log(`[${i}] Send: ${msg}`);
//     }, 100);
//   });
//   // setTimeout(function() {
//   //   connection.close();
//   //   process.exit(0);
//   // }, 500);
// });
