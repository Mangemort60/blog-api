require('dotenv').config();
const { S3 } = require('@aws-sdk/client-s3');

const region = 'eu-west-3';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

console.log('AWS Access Key:', process.env.AWS_ACCESS_KEY_ID);
console.log('AWS secret Key:', process.env.AWS_SECRET_ACCESS_KEY);
console.log('AWS Region:', process.env.AWS_REGION);

module.exports = s3;
