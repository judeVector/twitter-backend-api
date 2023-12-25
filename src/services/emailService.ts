import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import dotenv from "dotenv";
dotenv.config();

const ses = new SESClient({ region: process.env.AWS_REGION });

const createSendEmailCommand = (toAddress: string, fromAddress: string, message: string) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Source: fromAddress,
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: "Your One-Time Password",
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<p>${message}</p>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: message,
        },
      },
    },
  });
};

export const sendEmailToken = async (email: string, token: string) => {
  console.log("email: ", email, "token: ", token);

  const message = `Your one-time password: ${token}`;
  const command = createSendEmailCommand(email, "ikechukwujudendubuisi@gmail.com", message);

  try {
    const response = await ses.send(command);
    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    return error;
  }
};

// Example usage
// sendEmailToken(email, token);

// '$fault': 'client',
//   '$metadata': {
//     httpStatusCode: 400,
//     requestId: '82200f43-b388-4eb0-a0dc-6155be7ea190',
//     extendedRequestId: undefined,
//     cfId: undefined,
//     attempts: 1,
//     totalRetryDelay: 0

// '$metadata': {
//   httpStatusCode: 200,
//   requestId: '3909264e-e44f-4d30-ae03-f346ca80b0d9',
//   extendedRequestId: undefined,
//   cfId: undefined,
//   attempts: 1,
//   totalRetryDelay: 0
// },
// MessageId: '0110018ca28f026e-b5d20436-8e18-45c9-b855-a02ff1355892-000000'
