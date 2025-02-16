import dotenv from "dotenv";
dotenv.config();

export const RABBITMQ_URL = process.env.RABBITMQ_URL as string;
export const QUEUE_NAME = process.env.QUEUE_NAME as string;
export const QUEUE_NAME_FORGOT = process.env.QUEUE_NAME_FORGOT as string;
export const QUEUE_NAME_REGISTER = process.env.QUEUE_NAME_REGISTER as string;
