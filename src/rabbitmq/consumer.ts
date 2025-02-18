import * as amqp from "amqplib";
import dotenv from "dotenv";
import logger from "../utils/logger";
import { sendEmail } from "../utils/mailer";
import { RABBITMQ_URL, QUEUE_NAME_FORGOT, QUEUE_NAME_REGISTER } from "../config/rabbitConfig";

dotenv.config();

async function consumeQueue(queueName: string) {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        await channel.assertQueue(queueName, { durable: true });

        logger.info(`📩 Waiting for messages in ${queueName}`);

        channel.consume(queueName, async (msg: amqp.Message | null) => {
            if (msg) {
                try {
                    const messageContent = msg.content.toString();
                    const { type, email, subject, text, code }: 
                        { type: string; email: string; subject?: string; text?: string; code?: string } = 
                        JSON.parse(messageContent);

                    logger.info(`📨 Message received in ${queueName}:`, { type, email });

                    if (!email) {
                        logger.error("❌ Email is missing in the message, rejecting...");
                        channel.nack(msg, false, false);
                        return;
                    }

                    if (type === 'welcome') {
                        if (!subject || !text) {
                            logger.error("❌ Subject or text is missing for welcome email, rejecting...");
                            channel.nack(msg, false, false);
                            return;
                        }

                        logger.info(`📧 Sending Welcome Email to: ${email}`);
                        await sendEmail(email, subject, text);
                    } 
                    else if (type === 'password_reset') {
                        if (!code) {
                            logger.error("❌ Verification code is missing for password reset email, rejecting...");
                            channel.nack(msg, false, false);
                            return;
                        }

                        logger.info(`📧 Sending Password Reset Email to: ${email}`);
                        await sendEmail(email, "Password Reset Verification Code", `Your verification code is: ${code}`);
                    } 
                    else {
                        logger.error("❌ Unknown message type, rejecting...");
                        channel.nack(msg, false, false);
                        return;
                    }

                    channel.ack(msg);
                } catch (error) {
                    logger.error(`❌ Error processing message: ${error}`);
                    channel.nack(msg, false, false);
                }
            }
        });
    } catch (error) {
        logger.error(`❌ Error in consumeQueue (${queueName}): ${error}`);
    }
}

// Start consumers for both queues
consumeQueue(QUEUE_NAME_FORGOT);
consumeQueue(QUEUE_NAME_REGISTER);


//---------------------------------------------------FOR-STANDALONE-APPLICATIONS-------------------------------------------------------

// if wanna run it as standalone application.
/**
import amqp from "amqplib";
import dotenv from "dotenv";
import logger from "../utils/logger";
import { RABBITMQ_URL, QUEUE_NAME } from "../config/rabbitConfig";

dotenv.config();

async function consumeQueue() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });
    logger.info(`🚀 Waiting for messages in ${QUEUE_NAME}...`);

    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg) {
        const content = JSON.parse(msg.content.toString());
        logger.info(`📥 Received message: ${JSON.stringify(content)}`);
        
        channel.ack(msg);
      }
    });
  } catch (error) {
    logger.error(`❌ Error consuming ${QUEUE_NAME}: ${error.message}`);
  }
}

// Start consumer
consumeQueue();

 */