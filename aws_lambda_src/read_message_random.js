const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

/**
 * Gets a random item from the messages table.
 *
 * https://www.amitsn.com/blog/how-to-get-a-random-item-from-dynamodb
 */
exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "http://localhost:8080",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
    };

    try {
        switch (event.httpMethod) {
            case 'GET':
                const itemCountParams = {
                    TableName: "messages",
                    ProjectionExpression: "uid"
                };

                const dynamoResponse = await dynamo.scan(itemCountParams).promise();

                const randomIndex = Math.floor(Math.random() * (dynamoResponse.Count));

                // body = randomIndex;

                const randomMsgId = dynamoResponse.Items[randomIndex].uid;

                const params = {
                    TableName: "messages",
                    Key: {
                        uid: randomMsgId
                    }
                };

                body = await dynamo.get(params).promise();

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
