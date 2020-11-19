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
                // const message = JSON.parse(event.body);
                // const user = message.user
                const user = event.requestContext.authorizer.claims.sub;

                const userParams = {
                    TableName: "User",
                    Key: {
                        Username : user
                    }
                };

                var q = await dynamo.get(userParams).promise();

                //If the user exists
                if (q && q.Item) {
                    var queueString = q.Item.queue + "";
                    var queueArr = queueString.split(",");
                    body = queueArr.length;

                } else {
                    const params = {
                        TableName: "User",
                        Item: {
                            "Username": user,
                            "queue": ""
                        }
                    };
                    await dynamo.put(params).promise()
                    body = 0;
                }

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
