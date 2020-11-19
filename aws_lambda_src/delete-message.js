const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    //Metadata
    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST"
    };

    try {
        switch (event.httpMethod) {
            // commented out to prevent abuse
            // currently no mechanism to verify proper permission to delete
            // case 'DELETE':
            //     const message = JSON.parse(event.body);

            //     var tableName = "messages";

            //     await dynamo.delete({
            //         "TableName": tableName,
            //         "Key" : {
            //             "uid": message.uid
            //         }
            //     }, function (err, data) {
            //         if (err) {
            //             console.log("DEBUG:  Error deleting item from dynamodb - " + err);
            //         }
            //         else {
            //             console.log("DEBUG:  deleteItem worked. ");
            //         }
            //     }).promise();
            //     break;
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
