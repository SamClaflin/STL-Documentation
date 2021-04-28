const AWS = require("aws-sdk");

// Load environment variables from .env
require("dotenv").config();

// Initialize AWS configuration using loaded environment variables
const AWSConfig = {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    logger: console.log
};

// Initialize AWS Timestream query client using previously initialized AWS configuration
const config = new AWS.Config(AWSConfig);
const queryClient = new AWS.TimestreamQuery(config);

// Function to query all rows within the given Timestream database
async function getAllRows(query, NextToken) {
    const params = {
        QueryString: query
    };

    if (NextToken) {
        params.NextToken = NextToken;
        getAllRows(query, params.NextToken);
    }

    return await queryClient.query(params).promise()
}

module.exports = getAllRows;
