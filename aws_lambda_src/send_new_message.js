const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

/**
 * Sends a message into the DynamoDB database.
 *
 * HTTP POST request, body format:
 *
 * {
 *      "subject": "example subject2",
 *      "body": "example body2"
 * }
 */
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
                const sender = message.sender.attributes.sub
                
                //Gets the content of the event body defined in Vue
                const messageSubject = message.subject;
                const messageBody = message.body;

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
