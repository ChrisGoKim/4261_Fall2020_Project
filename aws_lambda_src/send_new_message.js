const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    //Metadata
    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST"
    };

    try {
        switch (event.httpMethod) {
            case 'POST':
                const message = JSON.parse(event.body);

                //Gets the metadata from event
                const sender = message.sender.attributes.sub;

                //Gets the content of the event body defined in Vue
                var messageSubject = message.subject;
                var messageBody = message.body;

                const offensiveWords = ["YmFzdGFyZA==", "Yml0Y2g=", "Y3VudA==", "ZmFnZ290", "ZnVjaw==", "bmlnZ2Vy", "c2hpdA==", "c2x1dA==", "d2hvcmU="];

                for (var i = 0; i < offensiveWords.length; i++) {
                    var offensiveWord = Buffer.from(offensiveWords[i], 'base64').toString();
                    messageSubject = messageSubject.replace(offensiveWord, "[redacted]");
                    messageBody = messageBody.replace(offensiveWord, "[redacted]");
                }

                if (messageBody.length > 2000) {
                    messageBody = messageBody.substring(0, 2000);
                }

                //Creates parameter based off of previous values and empty values
                const params = {
                    TableName: "messages",
                    Item: {
                        "uid": context.awsRequestId,
                        "subject": messageSubject,
                        "body": messageBody,
                        "readCounter" : 0,
                        "originalSender" : sender,
                        "targetedReceiver" : ""
                    }
                };

                body = await dynamo.put(params).promise();
                break;
            default:
                throw new Error(`Unsupported method "${event.httpMethod}"`);
        }
    } catch (err) {
        statusCode = '400';
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};
