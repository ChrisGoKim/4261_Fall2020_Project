const AWS = require('aws-sdk');
const cognitoIdentity = new AWS.CognitoIdentityServiceProvider({ region: 'us-east-1' }); //replace with the region of your user pool

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
    const UserPoolId = requestBody.requester.pool.userPoolId;


    const deleteParams = {
        "Username": Username,
        "UserPoolId": UserPoolId
    }

    try {
        await cognitoIdentity.adminDeleteUser(deleteParams).promise();
        body = "deletion successful"
    } catch (e) {
        console.log(`error deleting user ${Username}: ${e}`)
        body = `error deleting user ${Username}: ${e}`
        statusCode = '400'
    }

    return {
        statusCode,
        body,
        headers,
    }
}
