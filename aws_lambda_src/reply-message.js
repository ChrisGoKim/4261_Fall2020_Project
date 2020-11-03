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
                const sender = message.sender.attributes.sub
                const receiver = message.receiver
                
                //Gets the content of the event body defined in Vue
                const messageSubject = message.subject;
                const messageBody = message.body;
                
                const uid = context.awsRequestId

                //Creates parameter based off of previous values and empty values
                const params = {
                    TableName: "messages",
                    Item: {
                        "uid": uid,
                        "subject": messageSubject,
                        "body": messageBody,
                        "readCounter" : 0,
                        "originalSender" : sender,
                        "targetedReceiver" : receiver
                    }
                };
                //Adding to read Queue
                const userQParams = {
                    TableName: "User",
                    Item: {
                        "sub": sender,
                        "MessagesCSV": message.receiverQueue + "," + uid
                    }
                };

                await dynamo.put(userQParams).promise();
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
