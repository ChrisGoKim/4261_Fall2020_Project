const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

//READS MESSAGE QUEUE FOR A USER
//DOES NOT HANDLE THE DNE CASE!

exports.handler = async (event, context) => {

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Headers": "Origin, Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,PUT,GET"
    };

    try {
        switch (event.httpMethod) {
            case 'PUT':
                const message = JSON.parse(event.body);
                // const receiver = message.receiverSub
                const receiver = event.requestContext.authorizer.claims.sub;

                const userParams = {
                    TableName: "User",
                    Key: {
                        Username : receiver
                    }
                };

                var q = await dynamo.get(userParams).promise();

                var updatedQ = q.Item.queue;
                if (!updatedQ || updatedQ == "") {
                    updatedQ = message.uid;
                } else {
                    updatedQ = updatedQ + "," + message.uid;
                }

                var consent = q.Item.consent;

                const params_update = {
                    TableName: "User",
                    Item: {
                        "Username": receiver,
                        "queue": updatedQ,
                        "consent": consent
                    }
                };

                body = await dynamo.put(params_update).promise();

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
