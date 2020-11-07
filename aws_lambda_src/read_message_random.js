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
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
    };

    try {
        switch (event.httpMethod) {
            case 'GET':
                const itemCountParams = {
                    TableName: "messages",
                    ProjectionExpression: "uid",
                    FilterExpression: "targetedReceiver = :r",
                    ExpressionAttributeValues:{
                        ":r": ""
                    }
                };

                const dynamoResponse = await dynamo.scan(itemCountParams).promise();

                var randomIndex = Math.floor(Math.random() * (dynamoResponse.Count));

                // body = randomIndex;
                var hold = dynamoResponse.Items[randomIndex];
                
                while (hold.targetedReceiver == "") {
                    randomIndex = Math.floor(Math.random() * (dynamoResponse.Count));
                    hold = dynamoResponse.Items[randomIndex];
                }

                const randomMsgId = hold.uid;

                const params = {
                    TableName: "messages",
                    Key: {
                        uid: randomMsgId
                    }
                };

                body = await dynamo.get(params).promise();
                
                var readCounter =  body.Item.readCounter;
                if (!readCounter) {
                    readCounter = 1;
                } else {
                    readCounter = readCounter + 1;
                }
                
                if (readCounter < 10) {
                    const params_update = {
                        TableName: "messages",
                        Key:{
                            uid: randomMsgId
                        },
                        UpdateExpression: "set readCounter = :r",
                        ExpressionAttributeValues:{
                            ":r": readCounter
                        },
                        ReturnValues:"UPDATED_NEW"
                    };
                    await dynamo.update(params_update).promise();
                } else {
                    const params_delete = {
                        TableName: "messages",
                        Key:{
                            uid: randomMsgId
                        }
                    };
                    await dynamo.delete(params_delete).promise();
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
