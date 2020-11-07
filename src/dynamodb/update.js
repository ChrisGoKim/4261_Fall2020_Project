/**
 * https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html
 *
 * Copyright 2010-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * This file is licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License. A copy of
 * the License is located at
 *
 * http://aws.amazon.com/apache2.0/
 *
 * This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * Modifications Copyright 2020 Team CETD Enterprise.
 * Changes have been made to this file to adapt it to the needs of this project,
 * and for other purposes.
 */
var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1"
  // endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

var table = "testing";

// Update the item, unconditionally,

var params = {
  TableName: table,
  Key: {
    name: "first"
  },
  UpdateExpression: "set content = :c",
  ExpressionAttributeValues: {
    ":c": "this is some new content"
  },
  ReturnValues: "UPDATED_NEW"
};

console.log("Updating the item...");
docClient.update(params, function(err, data) {
  if (err) {
    console.error(
      "Unable to update item. Error JSON:",
      JSON.stringify(err, null, 2)
    );
  } else {
    console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
  }
});
