# RabbitMQ Service

This project is a **standalone RabbitMQ service** that can be used to send and process emails via RabbitMQ. It includes all necessary components (mailer, logger, producer, consumer, and configuration) and can function independently. The service listens to two queues (`EmailQueue` and `RegisterQueue`) and processes messages to send emails.

## Features

- **Two Queues**:
  - `EmailQueue`: Handles password reset emails.
  - `RegisterQueue`: Handles welcome emails for new user registrations.
- **Email Sending**: Uses Nodemailer to send emails.
- **Logging**: Uses Winston for structured logging.
- **Environment Variables**: Stores sensitive information (e.g., email credentials) in a `.env` file.
- **Standalone**: Can function independently with all necessary components included.

---

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [RabbitMQ](https://www.rabbitmq.com/) (running locally or on a server)
- [TypeScript](https://www.typescriptlang.org/) (optional, for development)

---

## Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/rabbitMQService.git
   cd rabbitMQService
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   RABBITMQ_URL=amqp://localhost
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-password
   ```

   Replace `your-email@gmail.com` and `your-email-password` with your email credentials. If you're using Gmail, you may need to generate an [app password](https://support.google.com/accounts/answer/185833).

4. **Start RabbitMQ**:
   Ensure RabbitMQ is running locally or on a server. You can start RabbitMQ using:
   ```bash
   rabbitmq-server
   ```

---

## Running the Service

### As a Standalone Service

To run the service as a standalone application, use the following command:

```bash
ts-node ./src/index.ts
```

This will start both the **producer** and **consumer** components, allowing you to send and process emails.

### Running the Consumer Only

To run only the consumer (e.g., in a production environment), use:

```bash
ts-node ./src/rabbitmq/consumer.ts
```

### Running the Producer Only

To run only the producer (e.g., for testing), use:

```bash
ts-node ./src/rabbitmq/producer.ts
```

---

## Project Structure

```
rabbitMQService/
├── src/
│   ├── config/
│   │   └── rabbitConfig.ts  # RabbitMQ configuration
│   ├── utils/
│   │   ├── logger.ts        # Centralized logger configuration
│   │   └── mailer.ts        # Email sending functionality
│   ├── rabbitmq/
│   │   ├── producer.ts      # RabbitMQ producer logic
│   │   └── consumer.ts      # RabbitMQ consumer logic
│   ├── index.ts             # Entry point for the standalone service
├── .env                     # Environment variables
├── package.json             # Project dependencies
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

---

## Message Formats

The consumer expects messages in the following formats:

### Welcome Email (Sent to `RegisterQueue`)
```json
{
  "type": "welcome",
  "email": "user@example.com",
  "subject": "Welcome to Our Platform",
  "text": "Welcome, username! Thank you for registering."
}
```

### Password Reset Email (Sent to `EmailQueue`)
```json
{
  "type": "password_reset",
  "email": "user@example.com",
  "subject": "Password Reset Verification Code",
  "text": "Your verification code is: 123456"
}
```

---

## Logs

The service logs all activities to the console and a file (`app.log`). Example logs:

```
[2025-02-16T18:22:18.219Z] info: 📩 Waiting for messages in EmailQueue
[2025-02-16T18:22:18.220Z] info: 📩 Waiting for messages in RegisterQueue
[2025-02-16T18:22:26.365Z] info: Message received from RabbitMQ: {"type":"welcome","email":"user@example.com","subject":"Welcome to Our Platform","text":"Welcome, username! Thank you for registering."}
[2025-02-16T18:22:26.366Z] info: 📧 Processing welcome email for: user@example.com
[2025-02-16T18:22:26.367Z] info: ✅ Email sent to user@example.com
```

---

## Standalone Usage

The project can be used as a standalone service. It includes:

1. **Producer**: Sends messages to the queues.
2. **Consumer**: Listens to both `EmailQueue` and `RegisterQueue` and processes messages.
3. **Logger**: Centralized logging using Winston.
4. **Mailer**: Handles email sending using Nodemailer.

### Example: Sending a Test Message

To send a test message to the `RegisterQueue`, use the following code in `producer.ts`:

```typescript
import { sendWelcomeEmail } from "./rabbitmq/producer";

// Example usage
sendWelcomeEmail("user@example.com", "username");
```

Run the producer script to send a test message:

```bash
ts-node ./src/rabbitmq/producer.ts
```

---

## Troubleshooting

### Common Issues

1. **RabbitMQ Connection Error**:
   - Ensure RabbitMQ is running and accessible.
   - Check the `RABBITMQ_URL` in the `.env` file.

2. **Email Sending Error**:
   - Verify the email credentials in the `.env` file.
   - Ensure the email service (e.g., Gmail) allows less secure apps or uses an app password.

3. **TypeScript Compilation Error**:
   - Ensure `tsconfig.json` is correctly configured.
   - Run `tsc` to compile the TypeScript files.

### Debugging Tips

- Check the logs in `app.log` for detailed error messages.
- Use `console.log` or `logger.info` to debug specific parts of the code.

---

## Contributing

Contributions are welcome! If you find a bug or want to add a feature, please open an issue or submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
