var AWS = require("aws-sdk");
let awsConfig = {
  region: "us-east-1",
  endpoint: "http://dynamodb.us-east-1.amazonaws.com",
  accessKeyId: "AKIAZ3JL4ZSTQNYNUHU3",
  secretAccessKey: "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",
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB({
  region: awsConfig.region,
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.secretAccessKey,
});

//-------------------------------------------------------------------------------------------------------------------------

//                     Different methods I tried to connect to database but didnt worked for me

// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import {
//   DynamoDBDocumentClient,
//   ScanCommand,
//   PutCommand,
//   GetCommand,
//   DeleteCommand,
// } from "@aws-sdk/lib-dynamodb";

// const client = new DynamoDBClient({});

// const dynamo = DynamoDBDocumentClient.from(client);

// const tableName = "failedmessages";

// body = await dynamo.send(
//           new ScanCommand({ TableName: tableName })
//         );
//         body = body.Items;
//         console.log(body,"this is body");

// Load the AWS SDK for Node.js
// var AWS = require('aws-sdk');
// // Set the region
// AWS.config.update({region: 'REGION'});

// Create the DynamoDB service object
// var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
// console.log(ddb,"this is dbb");
// aws ddb get-item --consistent-read \
//  --table-name failedmessages \

//--------------------------------------------------------------------------------------------------------------------------------------

// function to handle receiver end receiving messages from the sqs queue
exports.handler = async (event) => {
  const body = JSON.parse(event.Records[0].body);

  if (body.message >= 5) {
    console.log("This message is passed", body.messageId);
  } else {
    console.log("i am here");
    // error message
    // save in db

    console.log("This message is failed", body.messageId);

    var input = {
      message_id: {
        S: body.messageId.toString(),
      },
    };
    var params = {
      TableName: "failedmessages",
      Item: input,
    };

    // Call DynamoDB to add the item to the table

    try {
      const data = await docClient.putItem(params).promise();
      console.log("Item entered successfully:", data);
      var response = {
        statusCode: 200,
        body: JSON.stringify({
          message: "Data entered successfully",
        }),
      };

      return response;
    } catch (err) {
      console.log("Error: ", err);
    }
  }
};
