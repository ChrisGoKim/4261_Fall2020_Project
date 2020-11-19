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

    var uidInbox;

    try {
        if (event.httpMethod == 'PUT') {
            // Get user inbox queue
            const message = JSON.parse(event.body);
            const inboxOwner = message.inboxOwner

            const userParams = {
                TableName: "User",
                Key: {
                    Username : inboxOwner.attributes.sub
                }
            };

            var q = await dynamo.get(userParams).promise();

            var queueString = q.Item.queue + "";
            var queueArr = queueString.split(",");

            uidInbox = queueArr[0];

            queueArr.shift();
            queueArr = queueArr.join(",");

            //Parameters to remove the first inbox item from the queue
            const queueUpdateParams = {
                TableName: "User",
                Key: {
                    Username : inboxOwner.attributes.sub
                },
                UpdateExpression: "set queue = :q",
                ExpressionAttributeValues:{
                    ':q': queueArr
                },
                ReturnValues:"UPDATED_NEW"
            };
            //Updates the user inbox
            await dynamo.update(queueUpdateParams).promise();
        } else {
            throw new Error(`Unsupported method "${event.httpMethod}"`);
        }
    } catch (err) {
        statusCode = '400';
        body = err.message;
    }

    try {
        // Try to get message
        if (uidInbox != "" && uidInbox != null && uidInbox != "undefined") {
            const params = {
                TableName: "messages",
                Key: {
                    uid: uidInbox
                }
            };

            body = await dynamo.get(params).promise();

            // If the message does not exist in database
            if (body == "" || body == null || body.Item == null) {
                body = {
                    "Item": {
                        "subject": "Message No Longer Exists",
                        "originalSender": null,
                        "readCounter": null,
                        "uid": "00000000-0000-0000-0000-000000000000",
                        "body": "This message has been deleted by the sender. Please try again!"
                    }
                }
                // Delete message from database
            } else {
                await dynamo.delete(params).promise();
            }

        } else if (statusCode == '200') {
            body = {
                "Item": {
                    "subject": "No Messages Available",
                    "originalSender": null,
                    "readCounter": null,
                    "uid": "00000000-0000-0000-0000-000000000000",
                    "body": "There are currently no messages in your inbox. Send one today!"
                }
            }
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
