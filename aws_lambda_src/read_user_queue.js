const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
    };

    try {
        switch (event.httpMethod) {
            case 'GET':
                const itemCountParams = {
                    TableName: "User",
                    ProjectionExpression: "sub"
                };
                
                const dynamoResponse = await dynamo.scan(itemCountParams).promise();
                
                const message = JSON.parse(event.body);


                const params = {
                    TableName: "User",
                    Key: {
                        sub: message.sub
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
