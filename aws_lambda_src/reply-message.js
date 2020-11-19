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
                // const sender = message.sender.attributes.sub
                const sender = event.requestContext.authorizer.claims.sub;
                const receiver = message.receiver

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


                // trim everything beyond 4020 characters
                // (approx 2000 chars reply, 20 for header, 2000 prev message)
                if (messageBody.length > 4020) {
                    messageBody = messageBody.substring(0, 4020);
                }

                // trim everything beyond 110 characters
                // (100 chars subject, 10 for header info)
                if (messageSubject.length > 110) {
                    messageSubject = messageSubject.substring(0, 110);
                }

                const newUID = context.awsRequestId

                //Creates parameter based off of previous values and empty values
                const params = {
                    TableName: "messages",
                    Item: {
                        "uid": newUID,
                        "subject": messageSubject,
                        "body": messageBody,
                        "readCounter" : 0,
                        "originalSender" : sender,
                        "targetedReceiver" : receiver
                    }
                };
                await dynamo.put(params).promise();

                body = await dynamo.get({TableName: "messages", Key: { uid: newUID },}).promise();
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
