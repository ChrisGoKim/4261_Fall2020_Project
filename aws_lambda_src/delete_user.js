const AWS = require('aws-sdk');
const cognitoIdentity = new AWS.CognitoIdentityServiceProvider({ region: 'us-east-1' }); //replace with the region of your user pool

let UserPoolId = process.env.UserPoolId;


exports.handler = async (event) => {
    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
    };

    const { Username, UserPoolId } = event;

    const deleteParams = {
        "Username": Username,
        "UserPoolId": UserPoolId
    }

    try {
        body = await cognitoIdentity.adminDeleteUser(deleteParams).promise();
    } catch (e) {
        console.log(`error deleting user ${Username}: ${e}`)
        throw e;
    }

    return {
        statusCode,
        body,
        headers,
    }
}
