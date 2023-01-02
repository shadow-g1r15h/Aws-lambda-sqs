const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
const sqs = new AWS.SQS(); // using the amazon sqs queue to store the messages
const sqsURL = "https://sqs.us-east-1.amazonaws.com/677086284967/kloudMate";
const numberOfMessages = 10; // 10 messages to be stored in the queue

exports.handler = async (event: any) => {
  let messageId = 1000;
  const records = [];
  for (let i = 0; i < numberOfMessages; i++) {
    const params = {
      MessageBody: JSON.stringify({
        messageId: messageId,
        message: Math.floor(Math.random() * 10),
        timestamp: new Date().toISOString(),
      }),
      QueueUrl: sqsURL,
    };
    records.push(params);
    messageId++;
  }
  for (const record of records) {
    await sqs
      .sendMessage(record)
      .promise()
      .then(
        (response: any) => {
          console.log(JSON.stringify(response));
        },
        (error: any) => {
          console.error(error);
        }
      );
  }
};
