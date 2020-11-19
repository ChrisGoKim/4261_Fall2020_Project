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

                if (!messageSubject || !messageBody) {
                    throw new Error(`Message subject and body cannot be empty.`);
                }

                const offensiveWords = ["YmFzdGFyZA==", "Yml0Y2g=", "Y3VudA==", "ZmFnZ290", "ZnVjaw==", "bmlnZ2Vy", "c2hpdA==", "c2x1dA==", "d2hvcmU="];

                for (var i = 0; i < offensiveWords.length; i++) {
                    var offensiveWord = Buffer.from(offensiveWords[i], 'base64').toString();
                    var regEx = new RegExp(offensiveWord, "ig");

                    messageSubject = messageSubject.replace(regEx, "[redacted]");
                    messageBody = messageBody.replace(regEx, "[redacted]");
                }

                if (messageBody.length > 2010) {
                    messageBody = messageBody.substring(0, 2010);
                }

                if (messageSubject.length > 110) {
                    messageSubject = messageSubject.substring(0, 110);
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
