const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

/**
 * Gets user's consent from the User table
 *
 */
exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,PUT,GET"
    };

    try {
        switch (event.httpMethod) {
            case 'PUT':
                // const message = JSON.parse(event.body);
                // var user = message.currUser
                const user = event.requestContext.authorizer.claims.sub;

                const params = {
                    TableName: "User",
                    Key: {
                        Username : user
                    },
                    ProjectionExpression: "Username, consent"
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
