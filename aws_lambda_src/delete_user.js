const AWS = require('aws-sdk');
const cognitoIdentity = new AWS.CognitoIdentityServiceProvider({ region: 'us-east-1' });
const dynamo = new AWS.DynamoDB.DocumentClient();

// let UserPoolId = process.env.UserPoolId;


exports.handler = async (event) => {
    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
    };

    const requestBody = JSON.parse(event.body);

    const Username = requestBody.requester.username;
    const UserID = requestBody.requester.attributes.sub;
    const UserPoolId = requestBody.requester.pool.userPoolId;

    body = `deleting user ${UserID} (${Username})`

    // delete sent messages from messages table
    try {
        const getSentMessagesParams = {
            TableName: "messages",
            ProjectionExpression: "uid",
            FilterExpression: "originalSender = :s",
            ExpressionAttributeValues:{
                ":s": UserID
            }
        };

        var sentMessageID;
        var deleteSentMessageParams;

        const sentMessages = await dynamo.scan(getSentMessagesParams).promise();
        for (var i = 0; i < sentMessages.Count; i++) {
            sentMessageID = sentMessages.Items[i].uid;
            deleteSentMessageParams = {
                TableName: "messages",
                Key:{
                    uid: sentMessageID
                }
            };
            await dynamo.delete(deleteSentMessageParams).promise();
        }

        body += `; successfully deleted sent messages from messages table`

    } catch (e) {
        body += `; error deleting sent messages from messages table: ${e}`
        statusCode = '400'
    }

    // delete received messages from messages table
    try {
        const getUserFromTableParams = {
            TableName: "User",
            Key: {
                Username : UserID
            }
        };

        var receivedMessageID;
        var deleteReceivedMessageParams;

        var userInbox = await dynamo.get(getUserFromTableParams).promise();

        if (userInbox != null && userInbox.Item != null) {
            var queueString = userInbox.Item.queue + "";
            var queueArr = queueString.split(",");

            for (var j = 0; j < queueArr.length; j++) {
                receivedMessageID = queueArr[j];
                if (receivedMessageID != null && receivedMessageID != "") {
                    deleteReceivedMessageParams = {
                        TableName: "messages",
                        Key:{
                            uid: receivedMessageID
                        }
                    };
                    await dynamo.delete(deleteReceivedMessageParams).promise();
                }
            }
        }

        // delete user from User table
        await dynamo.delete(getUserFromTableParams).promise();

        body += `; successfully deleted received messages from messages table`

    } catch (e) {
        body += `; error deleting received messages from messages table: ${e}`
        statusCode = '400'
    }

    // delete user from AWS Cognito
    try {
        const cognitoDeleteParams = {
            "Username": Username,
            "UserPoolId": UserPoolId
        }

        await cognitoIdentity.adminDeleteUser(cognitoDeleteParams).promise();

        body += `; successfully deleted user from AWS Cognito`

    } catch (e) {
        body += `; error deleting user from AWS Cognito: ${e}`
        statusCode = '400'
    }

    return {
        statusCode,
        body,
        headers,
    }
}
