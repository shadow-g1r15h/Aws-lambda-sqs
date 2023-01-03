const AWS = require("aws-sdk");
// import AWS from 'aws-sdk';
AWS.config.update({ region: "us-east-1" });
const sqs = new AWS.SQS();
const sqsURL = "https://sqs.us-east-1.amazonaws.com/677086284967/kloudMate";
const numberOfMessages = 10;

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
      // MessageDeduplicationId: messageId.toString(),
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
