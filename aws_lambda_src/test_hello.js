console.log('Loading function');

exports.handler = async (event, context, callback) => {
    let min = 0;
    let max = 10

    let genNum = Math.floor(Math.random() * max) + min;

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(genNum),
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "http://localhost:8080",
            "Access-Control-Allow-Methods": "OPTIONS,GET"

        }
    });

    return genNum;
};
