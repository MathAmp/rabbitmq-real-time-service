//amqp데이터 타입을 설치해야함
import amqp, { Connection } from 'amqplib/callback_api' 
import dotenv from 'dotenv'
dotenv.config()
//amqp 기본 포트 5672, 관리자 사이트 포트-15672
const amqpURL: string = process.env.RABBITMQ_URL ||'amqp://guest:guest@127.0.0.1:5672'

export default (callback: Function) => {
  amqp.connect(amqpURL,
    (error: any, conection: Connection) => {
    if (error) {
      console.log(error)
      throw new Error(error);
    }

    callback(conection);
  })
}
