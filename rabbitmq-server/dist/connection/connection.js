"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//amqp데이터 타입을 설치해야함
const callback_api_1 = __importDefault(require("amqplib/callback_api"));
//amqp 기본 포트 5672, 관리자 사이트 포트-15672
// const amqpURL: string = 'amqp://guest:guest@127.0.0.1:5672'
const amqpURL = 'amqps://avrkjsxl:W-rDWNQ7k-xB-uvgOui-M5X1Dx9NxsfO@dingo.rmq.cloudamqp.com/avrkjsxl';
exports.default = (callback) => {
    callback_api_1.default.connect(amqpURL, (error, conection) => {
        if (error) {
            console.log(error);
            throw new Error(error);
        }
        callback(conection);
    });
};
