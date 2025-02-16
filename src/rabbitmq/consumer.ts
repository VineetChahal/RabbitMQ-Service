import * as amqp from "amqplib";
import dotenv from "dotenv";
import logger from "../utils/logger";
import { sendEmail } from "../utils/mailer";

dotenv.config();

const QUEUE_NAME_FORGOT = "EmailQueue";
const QUEUE_NAME_REGISTER = "RegisterQueue";

async function consumeMessages() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME_FORGOT, { durable: true });
    await channel.assertQueue(QUEUE_NAME_REGISTER, { durable: true });

    logger.info(`📩 Waiting for messages in ${QUEUE_NAME_FORGOT}`);
    logger.info(`📩 Waiting for messages in ${QUEUE_NAME_REGISTER}`);

    channel.consume(QUEUE_NAME_FORGOT || QUEUE_NAME_REGISTER, async (msg: amqp.Message | null) => {
      if (msg) {
        const messageContent = msg.content.toString();
        logger.info("Message received from RabbitMQ:", messageContent);

        try {
          const { type, email, subject, text, code }: 
            { type: string; email: string; subject?: string; text?: string; code?: string } = 
            JSON.parse(messageContent);

          logger.info("Parsed Message:", { type, email, subject, text, code });

          if (!email) {
            logger.error("Email is missing in the message");
            return;
          }

          if (type === 'welcome') {
            // Handle welcome email
            if (!subject || !text) {
              logger.error("Subject or text is missing for welcome email");
              return;
            }

            logger.info(`📧 Processing welcome email for: ${email}`);
            await sendEmail(email, subject, text);
          } else if (type === 'password_reset') {
            // Handle password reset email
            if (!code) {
              logger.error("Verification code is missing for password reset email");
              return;
            }

            logger.info(`📧 Processing password reset email for: ${email}`);
            await sendEmail(email, "Password Reset Verification Code", `Your verification code is: ${code}`);
          } else {
            logger.error("Unknown message type:", type);
            return;
          }

          channel.ack(msg);
        } catch (error) {
          logger.error(`❌ Error parsing message: ${error}`);
        }
      }
    });
  } catch (error) {
    logger.error(`❌ Error in consumeMessages: ${error}`);
  }
}

// Start consuming messages
consumeMessages().catch((error) => logger.error(`❌ Error: ${error}`));