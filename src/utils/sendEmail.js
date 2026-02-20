const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress, subject, message) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<!DOCTYPE html><html><body style="margin:0;padding:20px;font-family:Arial,sans-serif;background:#f4f6f8;"><div style="max-width:600px;margin:auto;background:#ffffff;padding:20px;border-radius:6px;text-align:center;"><h2 style="color:#4f46e5;margin:0;">Welcome! Your account has been successfully created 🚀</h2></br><h5>${message}</h5></div></body></html>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "Hi The email is for Onboarding",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async (subject, message) => {
  const sendEmailCommand = createSendEmailCommand(
    "febin9460@gmail.com",
    "Tom@webinx.online",
    subject,
    message,
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

module.exports = { run };
