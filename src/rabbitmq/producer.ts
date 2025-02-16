// import amqp from "amqplib";
// import { RABBITMQ_URL, QUEUE_NAME } from "../config/rabbitConfig";

// export async function sendToQueue(msg: object) {
//   const connection = await amqp.connect(RABBITMQ_URL);
//   const channel = await connection.createChannel();

//   await channel.assertQueue(QUEUE_NAME, { durable: true });
//   channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(msg)), { persistent: true });

//   console.log("📤 Sent:", msg);
//   await channel.close();
//   await connection.close();
// }
